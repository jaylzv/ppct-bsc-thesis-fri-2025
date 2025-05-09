import { BrowserClient } from './client.js';
import { DEBUG_BUILD } from './debug-build.js';
import { WINDOW } from './helpers.js';
import { breadcrumbsIntegration } from './integrations/breadcrumbs.js';
import { browserApiErrorsIntegration } from './integrations/browserapierrors.js';
import { browserSessionIntegration } from './integrations/browsersession.js';
import { globalHandlersIntegration } from './integrations/globalhandlers.js';
import { httpContextIntegration } from './integrations/httpcontext.js';
import { linkedErrorsIntegration } from './integrations/linkederrors.js';
import { defaultStackParser } from './stack-parsers.js';
import { makeFetchTransport } from './transports/fetch.js';
import { consoleSandbox, logger } from '../../../../core/build/esm/utils-hoist/logger.js';
import { supportsFetch } from '../../../../core/build/esm/utils-hoist/supports.js';
import { getIntegrationsToSetup } from '../../../../core/build/esm/integration.js';
import { stackParserFromStackParserOptions } from '../../../../core/build/esm/utils-hoist/stacktrace.js';
import { initAndBind } from '../../../../core/build/esm/sdk.js';
import { getLocationHref } from '../../../../core/build/esm/utils-hoist/browser.js';
import { inboundFiltersIntegration } from '../../../../core/build/esm/integrations/inboundfilters.js';
import { functionToStringIntegration } from '../../../../core/build/esm/integrations/functiontostring.js';
import { dedupeIntegration } from '../../../../core/build/esm/integrations/dedupe.js';

/** Get the default integrations for the browser SDK. */
function getDefaultIntegrations(_options) {
  /**
   * Note: Please make sure this stays in sync with Angular SDK, which re-exports
   * `getDefaultIntegrations` but with an adjusted set of integrations.
   */
  return [
    inboundFiltersIntegration(),
    functionToStringIntegration(),
    browserApiErrorsIntegration(),
    breadcrumbsIntegration(),
    globalHandlersIntegration(),
    linkedErrorsIntegration(),
    dedupeIntegration(),
    httpContextIntegration(),
    browserSessionIntegration(),
  ];
}

/** Exported only for tests. */
function applyDefaultOptions(optionsArg = {}) {
  const defaultOptions = {
    defaultIntegrations: getDefaultIntegrations(),
    release:
      typeof __SENTRY_RELEASE__ === 'string' // This allows build tooling to find-and-replace __SENTRY_RELEASE__ to inject a release value
        ? __SENTRY_RELEASE__
        : WINDOW.SENTRY_RELEASE?.id, // This supports the variable that sentry-webpack-plugin injects
    sendClientReports: true,
  };

  return {
    ...defaultOptions,
    ...dropTopLevelUndefinedKeys(optionsArg),
  };
}

/**
 * In contrast to the regular `dropUndefinedKeys` method,
 * this one does not deep-drop keys, but only on the top level.
 */
function dropTopLevelUndefinedKeys(obj) {
  const mutatetedObj = {};

  for (const k of Object.getOwnPropertyNames(obj)) {
    const key = k ;
    if (obj[key] !== undefined) {
      mutatetedObj[key] = obj[key];
    }
  }

  return mutatetedObj;
}

function shouldShowBrowserExtensionError() {
  const windowWithMaybeExtension =
    typeof WINDOW.window !== 'undefined' && (WINDOW );
  if (!windowWithMaybeExtension) {
    // No need to show the error if we're not in a browser window environment (e.g. service workers)
    return false;
  }

  const extensionKey = windowWithMaybeExtension.chrome ? 'chrome' : 'browser';
  const extensionObject = windowWithMaybeExtension[extensionKey];

  const runtimeId = extensionObject?.runtime?.id;
  const href = getLocationHref() || '';

  const extensionProtocols = ['chrome-extension:', 'moz-extension:', 'ms-browser-extension:', 'safari-web-extension:'];

  // Running the SDK in a dedicated extension page and calling Sentry.init is fine; no risk of data leakage
  const isDedicatedExtensionPage =
    !!runtimeId && WINDOW === WINDOW.top && extensionProtocols.some(protocol => href.startsWith(`${protocol}//`));

  // Running the SDK in NW.js, which appears like a browser extension but isn't, is also fine
  // see: https://github.com/getsentry/sentry-javascript/issues/12668
  const isNWjs = typeof windowWithMaybeExtension.nw !== 'undefined';

  return !!runtimeId && !isDedicatedExtensionPage && !isNWjs;
}

/**
 * A magic string that build tooling can leverage in order to inject a release value into the SDK.
 */

/**
 * The Sentry Browser SDK Client.
 *
 * To use this SDK, call the {@link init} function as early as possible when
 * loading the web page. To set context information or send manual events, use
 * the provided methods.
 *
 * @example
 *
 * ```
 *
 * import { init } from '@sentry/browser';
 *
 * init({
 *   dsn: '__DSN__',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * import { addBreadcrumb } from '@sentry/browser';
 * addBreadcrumb({
 *   message: 'My Breadcrumb',
 *   // ...
 * });
 * ```
 *
 * @example
 *
 * ```
 *
 * import * as Sentry from '@sentry/browser';
 * Sentry.captureMessage('Hello, world!');
 * Sentry.captureException(new Error('Good bye'));
 * Sentry.captureEvent({
 *   message: 'Manual',
 *   stacktrace: [
 *     // ...
 *   ],
 * });
 * ```
 *
 * @see {@link BrowserOptions} for documentation on configuration options.
 */
function init(browserOptions = {}) {
  const options = applyDefaultOptions(browserOptions);

  if (!options.skipBrowserExtensionCheck && shouldShowBrowserExtensionError()) {
    if (DEBUG_BUILD) {
      consoleSandbox(() => {
        // eslint-disable-next-line no-console
        console.error(
          '[Sentry] You cannot run Sentry this way in a browser extension, check: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/',
        );
      });
    }
    return;
  }

  if (DEBUG_BUILD && !supportsFetch()) {
    logger.warn(
      'No Fetch API detected. The Sentry SDK requires a Fetch API compatible environment to send events. Please add a Fetch API polyfill.',
    );
  }
  const clientOptions = {
    ...options,
    stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
    integrations: getIntegrationsToSetup(options),
    transport: options.transport || makeFetchTransport,
  };

  return initAndBind(BrowserClient, clientOptions);
}

export { applyDefaultOptions, getDefaultIntegrations, init };
