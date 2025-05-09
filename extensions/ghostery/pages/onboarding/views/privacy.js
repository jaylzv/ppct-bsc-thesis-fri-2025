import router from '../../../npm/hybrids/src/router.js';
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


function scrollToAnchor(host, event) {
  let anchor = event.target;
  while (anchor && !anchor.href) {
    anchor = anchor.parentElement;
  }

  if (anchor && anchor.host === window.location.host && anchor.hash) {
    event.preventDefault();
    event.stopPropagation();

    const target = host.shadowRoot.getElementById(anchor.hash.substr(1));
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

const __vite_glob_0_8 = {
  [router.connect]: { dialog: true },
  policy: () =>
    fetch(chrome.runtime.getURL('/static_pages/privacy-policy.html')).then(
      (res) => {
        if (res.ok) {
          return res.text();
        }

        throw new Error('Failed to load privacy policy');
      },
    ),
  render: ({ policy }) => html`
    <onboarding-dialog>
      <ui-text slot="header" type="headline-m">
        Ghostery Privacy Policy
      </ui-text>
      <div>
        ${html.resolve(
          policy.then(
            (policy) =>
              html`<div
                id="policy"
                onclick="${scrollToAnchor}"
                innerHTML="${policy}"
                data-qa="text:privacy-policy"
              ></div>`,
          ),
        )}
      </div>
      <ui-button slot="footer">
        <a href="${router.backUrl()}">Close</a>
      </ui-button>
    </onboarding-dialog>
  `.css`
    #policy { min-height: 100vh; }
    #policy h1 { display: none }
    #policy h1 + p { margin-top: 0; }
    #policy h3, #policy .side-menu .cap { font: var(--ui-font-headline-s); font-weight: 400; color: var(--ui-color-gray-800); margin: 16px 0; }
    #policy .side-menu .cap { font: var(--ui-font-headline-s); }
    #policy ul { list-style: none; padding: 0; margin: 16px 0; }
    #policy ul li { font: var(--ui-font-body-m); margin: 0; }
    #policy ul li a { text-decoration: none }
    #policy p { font: var(--ui-font-body-m); margin: 16px 0; }
    #policy a { color: var(--ui-color-gray-800); font-weight: bold; }
    #policy code { white-space: initial; }

    #policy .breadcrumb, #policy h2, #policy ul li.child { display: none }
  `,
};

export { __vite_glob_0_8 as default };
