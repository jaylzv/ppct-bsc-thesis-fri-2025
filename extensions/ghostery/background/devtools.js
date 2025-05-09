import DailyStats from '../store/daily-stats.js';
import Options from '../store/options.js';
import Config from '../store/config.js';
import { deleteDatabases } from '../utils/indexeddb.js';
import syncConfig from './config.js';
import store from '../npm/hybrids/src/store.js';

/**
 * Ghostery Browser Extension
 * https://www.ghostery.com/
 *
 * Copyright 2017-present Ghostery GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.action) {
    case 'clearStorage':
      (async () => {
        try {
          console.info('[devtools] Clearing main local storage');
          chrome.storage.local.clear();

          console.info('[devtools] Removing all indexedDBs...');
          await deleteDatabases().catch((e) => {
            console.error('[devtools] Error removing indexedDBs:', e);
          });

          console.info('[devtools] Clearing store cache');
          try {
            store.clear(Options);
            store.clear(DailyStats);
            store.clear(Config);
          } catch (e) {
            console.error('[devtools] Error clearing store cache:', e);
          }

          await store.resolve(Options);

          sendResponse('Storage cleared');
        } catch (e) {
          sendResponse(`[devtools] Error clearing storage: ${e}`);
        }
      })();

      return true;
    case 'syncConfig':
      (async () => {
        try {
          await store.set(Config, { updatedAt: 0 });
          await syncConfig();

          sendResponse('Config synced');
        } catch (e) {
          sendResponse(`[devtools] Error syncing config: ${e}`);
        }
      })();

      return true;
  }

  return false;
});
