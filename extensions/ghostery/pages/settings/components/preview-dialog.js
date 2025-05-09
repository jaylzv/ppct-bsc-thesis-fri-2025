import { html } from '../../../npm/hybrids/src/template/index.js';
import router from '../../../npm/hybrids/src/router.js';

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


function clickOnClose(host) {
  const anchor = host.shadowRoot.querySelector('a');
  anchor.click();
}

const __vite_glob_0_10 = {
  render: () => html`
    <template layout="contents">
      <main
        layout="
          block fixed inset layer:100
          margin:0 padding:2.5 overflow:auto
        "
        onclick="${clickOnClose}"
      >
        <section
          layout="column content:center gap:2 height::full margin:0:auto"
          layout@786px="width:::728px"
          layout@992px="width:::912px"
          layout@1280px="width:::1200px"
        >
          <slot></slot>
          <footer layout="padding:2">
            <slot name="footer"></slot>
          </footer>
        </section>
      </main>
      <ui-action>
        <a
          href="${router.backUrl()}"
          layout="row center size:6 fixed top:2.5 right:2.5 layer:100"
        >
          <ui-icon name="close" layout="size:3" color="gray-800"></ui-icon>
        </a>
      </ui-action>
    </template>
  `.css`
    main {
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
    }

    a {
      background: var(--ui-color-layout);
      border-radius: 50%;
      box-shadow: 0px 4px 16px rgba(32, 44, 68, 0.1);
    }

    ::slotted(img) {
      display: block;
      aspect-ratio: 12 / 8;
      max-width: 100%;
      max-height: 80vh;
      border-radius: 8px;
      overflow: hidden;
      object-fit: cover;
    }

    footer {
      background: var(--ui-color-layout);
      border-radius: 8px;
    }
  `,
};

export { __vite_glob_0_10 as default };
