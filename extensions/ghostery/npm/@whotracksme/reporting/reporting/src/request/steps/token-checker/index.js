import cachedMD5, { truncatedHash } from '../../../md5.js';
import { tryDecodeURIComponent } from '../../../utils/url.js';
import TokenDomain from './token-domain.js';

/**
 * WhoTracks.Me
 * https://whotracks.me/
 *
 * Copyright 2017-present Ghostery GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */


function decodeToken(token) {
  let decodedToken = tryDecodeURIComponent(token);
  let doubleDecoded = tryDecodeURIComponent(decodedToken);
  while (decodedToken !== doubleDecoded) {
    decodedToken = doubleDecoded;
    doubleDecoded = tryDecodeURIComponent(decodedToken);
  }
  return decodedToken;
}

/**
 * This class checks url components for UIDs and exposes any 'badTokens' found.
 *
 * @class TokenChecker
 * @namespace antitracking.steps
 */
class TokenChecker {
  constructor(qsWhitelist, privateValues, shouldCheckToken, config, db) {
    this.qsWhitelist = qsWhitelist;
    this.config = config;
    this.debug = false;
    this.privateValues = privateValues;
    this.shouldCheckToken = shouldCheckToken;
    this.tokenDomain = new TokenDomain(config, db);
  }

  init() {
    // IMPORTANT: do NOT await
    // TokenDomain requires async startup but we cannot wait for sake of
    // assigning webRequest listeners
    this.tokenDomain.init();
  }

  unload() {
    this.tokenDomain.unload();
  }

  /**
   * Checks for uids in the request url and adds them to the pipeline state `badTokens`
   * attribute
   * @param  {Object} state Pipeline state object
   * @return {Boolean} true
   */
  findBadTokens(state) {
    const stats = {};
    state.isTracker = this.qsWhitelist.shouldCheckDomainTokens(
      truncatedHash(state.urlParts.generalDomain),
    );
    state.badTokens = this.checkTokens(
      state.urlParts,
      state.tabUrl,
      stats,
      state.tabUrlParts,
      state.isTracker,
      state.isPrivate,
    );
    // set stats
    if (state.incrementStat) {
      Object.keys(stats).forEach((key) => {
        if (stats[key] > 0) {
          state.incrementStat(`token.has_${key}`);
          state.incrementStat(`token.${key}`, stats[key]);
        }
      });
      if (state.badTokens.length > 0) {
        state.incrementStat('bad_qs');
        state.incrementStat('bad_tokens', state.badTokens.length);
      }
    }
    return true;
  }

  /**
   * Check all tokens of the url for uids.
   *
   * A token is a uid one of the following apply:
   *  - it matches the user's cookie for this page
   *  - it matches a private value from JS (from this.privateValues)
   *  - it is not on the global safe value list, and its key is not in local nor global
   *  safe key lists
   *
   * It must also meet that condition that the same value has been seen on multiple first
   * party domains (this.config.tokenDomainCountThreshold).
   *
   * @param  {Object} urlParts        Parts of the request url, as parsed by parseURL
   * @param  {String} tabUrl          The first party url for this request
     A map of cookie values in the first party page - keys are values
   * @param  {Object} stats            An object to write stats to
   * @param  {Object} tabUrlParts Parts of the source url, as parsed by parseURL
   * @param  {Boolean} tracker         True if the request host is a tracker
     Array of values which we think are uids and should be removed.
   * @return {Array}
   */
  checkTokens(urlParts, tabUrl, stats, tabUrlParts, tracker, isPrivate) {
    // This check is only done for trackers
    if (!tracker) {
      return [];
    }

    // if there are no query parameters, there is nothing to check
    const keyTokens = urlParts.extractKeyValues().params;
    if (keyTokens.length === 0) {
      return [];
    }

    const trackerDomain = truncatedHash(urlParts.generalDomain);
    const sourceDomain = truncatedHash(tabUrlParts.generalDomain);
    const badTokens = [];

    // check for each kv in the url
    const tokenStatus = keyTokens.map((kv) => {
      const key = kv[0];
      const tok = kv[1];

      // ignore values which don't look like identifiers
      if (!this.shouldCheckToken(tok)) {
        return 'no_check';
      }

      // if the value is in the main url, ignore
      if (tabUrl.indexOf(tok) > -1) {
        return 'sourceUrl';
      }

      // make different possible encodings of the token
      if (!this.shouldCheckToken(decodeToken(tok))) {
        return 'no_check_decoded';
      }

      // if we didn't already match a cookie or private value, do these steps
      if (this.qsWhitelist.isSafeKey(trackerDomain, cachedMD5(key))) {
        return 'safekey';
      }

      if (this.qsWhitelist.isSafeToken(trackerDomain, cachedMD5(tok))) {
        return 'whitelisted';
      }

      const tokenType = 'qs';

      // count thresholds for token values
      if (!isPrivate) {
        // increment that this token has been seen on this site
        this.tokenDomain.addTokenOnFirstParty(cachedMD5(tok), sourceDomain);
      }
      // check if the threshold for cross-domain tokens has been reached
      if (!this.tokenDomain.isTokenDomainThresholdReached(cachedMD5(tok))) {
        return `${tokenType}_newToken`;
      }

      badTokens.push(tok);
      return `${tokenType}_countThreshold`;
    });

    if (this.debug) {
      // debug message: labeled key values
      const tokenReport = keyTokens.map((kv, i) =>
        Object.assign(kv, { class: tokenStatus[i] }),
      );
      console.log('tokens', urlParts.hostname, tokenReport);
    }

    tokenStatus.forEach((s) => {
      if (!stats[s]) {
        stats[s] = 0;
      }
      stats[s] += 1;
    });

    return badTokens;
  }
}

export { TokenChecker as default };
