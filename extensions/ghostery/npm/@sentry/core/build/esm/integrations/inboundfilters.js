import { DEBUG_BUILD } from '../debug-build.js';
import { defineIntegration } from '../integration.js';
import { logger } from '../utils-hoist/logger.js';
import { getEventDescription } from '../utils-hoist/misc.js';
import { stringMatchesSomePattern } from '../utils-hoist/string.js';
import { getPossibleEventMessages } from '../utils/eventUtils.js';

// "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.
const DEFAULT_IGNORE_ERRORS = [
  /^Script error\.?$/,
  /^Javascript error: Script error\.? on line 0$/,
  /^ResizeObserver loop completed with undelivered notifications.$/, // The browser logs this when a ResizeObserver handler takes a bit longer. Usually this is not an actual issue though. It indicates slowness.
  /^Cannot redefine property: googletag$/, // This is thrown when google tag manager is used in combination with an ad blocker
  "undefined is not an object (evaluating 'a.L')", // Random error that happens but not actionable or noticeable to end-users.
  'can\'t redefine non-configurable property "solana"', // Probably a browser extension or custom browser (Brave) throwing this error
  "vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)", // Error thrown by GTM, seemingly not affecting end-users
  "Can't find variable: _AutofillCallbackHandler", // Unactionable error in instagram webview https://developers.facebook.com/community/threads/320013549791141/
  /^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/, // unactionable error from CEFSharp, a .NET library that embeds chromium in .NET apps
];

/** Options for the InboundFilters integration */

const INTEGRATION_NAME = 'InboundFilters';
const _inboundFiltersIntegration = ((options = {}) => {
  return {
    name: INTEGRATION_NAME,
    processEvent(event, _hint, client) {
      const clientOptions = client.getOptions();
      const mergedOptions = _mergeOptions(options, clientOptions);
      return _shouldDropEvent(event, mergedOptions) ? null : event;
    },
  };
}) ;

const inboundFiltersIntegration = defineIntegration(_inboundFiltersIntegration);

function _mergeOptions(
  internalOptions = {},
  clientOptions = {},
) {
  return {
    allowUrls: [...(internalOptions.allowUrls || []), ...(clientOptions.allowUrls || [])],
    denyUrls: [...(internalOptions.denyUrls || []), ...(clientOptions.denyUrls || [])],
    ignoreErrors: [
      ...(internalOptions.ignoreErrors || []),
      ...(clientOptions.ignoreErrors || []),
      ...(internalOptions.disableErrorDefaults ? [] : DEFAULT_IGNORE_ERRORS),
    ],
    ignoreTransactions: [...(internalOptions.ignoreTransactions || []), ...(clientOptions.ignoreTransactions || [])],
    ignoreInternal: internalOptions.ignoreInternal !== undefined ? internalOptions.ignoreInternal : true,
  };
}

function _shouldDropEvent(event, options) {
  if (options.ignoreInternal && _isSentryError(event)) {
    DEBUG_BUILD &&
      logger.warn(`Event dropped due to being internal Sentry Error.\nEvent: ${getEventDescription(event)}`);
    return true;
  }
  if (_isIgnoredError(event, options.ignoreErrors)) {
    DEBUG_BUILD &&
      logger.warn(
        `Event dropped due to being matched by \`ignoreErrors\` option.\nEvent: ${getEventDescription(event)}`,
      );
    return true;
  }
  if (_isUselessError(event)) {
    DEBUG_BUILD &&
      logger.warn(
        `Event dropped due to not having an error message, error type or stacktrace.\nEvent: ${getEventDescription(
          event,
        )}`,
      );
    return true;
  }
  if (_isIgnoredTransaction(event, options.ignoreTransactions)) {
    DEBUG_BUILD &&
      logger.warn(
        `Event dropped due to being matched by \`ignoreTransactions\` option.\nEvent: ${getEventDescription(event)}`,
      );
    return true;
  }
  if (_isDeniedUrl(event, options.denyUrls)) {
    DEBUG_BUILD &&
      logger.warn(
        `Event dropped due to being matched by \`denyUrls\` option.\nEvent: ${getEventDescription(
          event,
        )}.\nUrl: ${_getEventFilterUrl(event)}`,
      );
    return true;
  }
  if (!_isAllowedUrl(event, options.allowUrls)) {
    DEBUG_BUILD &&
      logger.warn(
        `Event dropped due to not being matched by \`allowUrls\` option.\nEvent: ${getEventDescription(
          event,
        )}.\nUrl: ${_getEventFilterUrl(event)}`,
      );
    return true;
  }
  return false;
}

function _isIgnoredError(event, ignoreErrors) {
  // If event.type, this is not an error
  if (event.type || !ignoreErrors || !ignoreErrors.length) {
    return false;
  }

  return getPossibleEventMessages(event).some(message => stringMatchesSomePattern(message, ignoreErrors));
}

function _isIgnoredTransaction(event, ignoreTransactions) {
  if (event.type !== 'transaction' || !ignoreTransactions || !ignoreTransactions.length) {
    return false;
  }

  const name = event.transaction;
  return name ? stringMatchesSomePattern(name, ignoreTransactions) : false;
}

function _isDeniedUrl(event, denyUrls) {
  if (!denyUrls?.length) {
    return false;
  }
  const url = _getEventFilterUrl(event);
  return !url ? false : stringMatchesSomePattern(url, denyUrls);
}

function _isAllowedUrl(event, allowUrls) {
  if (!allowUrls?.length) {
    return true;
  }
  const url = _getEventFilterUrl(event);
  return !url ? true : stringMatchesSomePattern(url, allowUrls);
}

function _isSentryError(event) {
  try {
    // @ts-expect-error can't be a sentry error if undefined
    return event.exception.values[0].type === 'SentryError';
  } catch (e) {
    // ignore
  }
  return false;
}

function _getLastValidUrl(frames = []) {
  for (let i = frames.length - 1; i >= 0; i--) {
    const frame = frames[i];

    if (frame && frame.filename !== '<anonymous>' && frame.filename !== '[native code]') {
      return frame.filename || null;
    }
  }

  return null;
}

function _getEventFilterUrl(event) {
  try {
    let frames;
    try {
      // @ts-expect-error we only care about frames if the whole thing here is defined
      frames = event.exception.values[0].stacktrace.frames;
    } catch (e) {
      // ignore
    }
    return frames ? _getLastValidUrl(frames) : null;
  } catch (oO) {
    DEBUG_BUILD && logger.error(`Cannot extract url for event ${getEventDescription(event)}`);
    return null;
  }
}

function _isUselessError(event) {
  if (event.type) {
    // event is not an error
    return false;
  }

  // We only want to consider events for dropping that actually have recorded exception values.
  if (!event.exception?.values?.length) {
    return false;
  }

  return (
    // No top-level message
    !event.message &&
    // There are no exception values that have a stacktrace, a non-generic-Error type or value
    !event.exception.values.some(value => value.stacktrace || (value.type && value.type !== 'Error') || value.value)
  );
}

export { inboundFiltersIntegration };
