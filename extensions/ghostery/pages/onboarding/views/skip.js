import { GHOSTERY_DOMAIN } from '../../../utils/urls.js';
import disabled from '../illustrations/disabled.js';
import { html } from '../../../npm/hybrids/src/template/index.js';

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


const TERMS_AND_CONDITIONS_URL = `https://www.${GHOSTERY_DOMAIN}/privacy/ghostery-terms-and-conditions?utm_source=gbe&utm_campaign=onboarding`;

const __vite_glob_0_9 = {
  render: () => html`
    <template layout="block">
      <ui-card data-qa="view:skip">
        <section layout="block:center column gap:2">
          <div layout="row center">${disabled}</div>
          <ui-text type="display-s" color="danger-500">
            Ghostery is installed with limited functionality
          </ui-text>
          <ui-text type="body-m">
            Ghostery Tracker & Ad Blocker is naming the trackers present on
            websites you visit. You are browsing the web unprotected.
          </ui-text>
          ${chrome.management?.uninstallSelf &&
          html`
            <ui-button
              type="danger"
              onclick="${() =>
                chrome.management.uninstallSelf({ showConfirmDialog: true })}"
              layout="self:center margin:top:2"
            >
              <button>Uninstall</button>
            </ui-button>
          `}
        </section>
      </ui-card>
      <ui-text layout="block:center margin:3:0" underline>
        <a href="${TERMS_AND_CONDITIONS_URL}" target="_blank">
          Terms & Conditions
        </a>
      </ui-text>
    </template>
  `,
};

export { __vite_glob_0_9 as default };
