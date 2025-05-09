import Options from '../../../store/options.js';
import Hostname from '../store/hostname.js';
import store from '../../../npm/hybrids/src/store.js';
import router from '../../../npm/hybrids/src/router.js';
import { html } from '../../../npm/hybrids/src/template/index.js';
import { msg } from '../../../npm/hybrids/src/localize.js';

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


async function add({ options, hostname, pauseType }, event) {
  event.preventDefault();

  router.resolve(
    event,
    store.submit(hostname).then(({ value }) => {
      if (options.paused[value]) return;

      return store.set(options, {
        paused: {
          [value]: {
            revokeAt: pauseType && Date.now() + 60 * 60 * 1000 * pauseType,
          },
        },
      });
    }),
  );
}

const __vite_glob_0_23 = {
  [router.connect]: { dialog: true },
  options: store(Options),
  hostname: store(Hostname, { draft: true }),
  pauseType: 1,
  render: ({ hostname, pauseType }) => html`
    <template layout>
      <settings-dialog>
        <form
          action="${router.backUrl()}"
          onsubmit="${add}"
          layout="column gap:3"
        >
          <ui-text type="label-l" layout="block:center margin:bottom">
            Add website
          </ui-text>
          <div layout="column gap items:start">
            <ui-text>To adjust privacy protection trust a site:</ui-text>
          </div>
          <div layout="column gap:0.5">
            <ui-text type="label-m">Website</ui-text>
            <ui-input error="${store.error(hostname) || ''}">
              <input
                type="text"
                placeholder="${msg`Enter website URL`}"
                value="${hostname.value}"
                oninput="${html.set(hostname, 'value')}"
                tabindex="1"
              />
            </ui-input>
          </div>
          <div layout="column gap:0.5">
            <ui-text type="label-m">Select time frame</ui-text>
            <ui-input>
              <select
                type="text"
                placeholder="${msg`Enter website URL`}"
                value="${pauseType}"
                oninput="${html.set('pauseType')}"
                tabindex="2"
              >
                <option value="1">1 hour</option>
                <option value="24">1 day</option>
                <option value="0">Always</option>
              </select>
            </ui-input>
          </div>
          <div layout="grid:1|1 gap margin:top:2">
            <ui-button>
              <a href="${router.backUrl()}" tabindex="2">Cancel</a>
            </ui-button>
            <ui-button type="primary">
              <button type="submit" tabindex="1">Save</button>
            </ui-button>
          </div>
        </form>
      </settings-dialog>
    </template>
  `,
};

export { __vite_glob_0_23 as default };
