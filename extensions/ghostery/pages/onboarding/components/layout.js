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


const __vite_glob_0_3 = {
  render: () => html`
    <template layout="relative column height::100% width::359px overflow">
      <div
        id="bg"
        layout="absolute top:-250px left:50% size:1648px:1525px layer:-1"
      >
        <div id="c-1" layout="absolute left:300px top:100px size:800px"></div>
        <div id="c-2" layout="absolute left:420px top:320px size:1200px"></div>
      </div>
      <header layout="row center self:stretch gap:2 height:88px">
        <ui-icon name="logo-with-slogan"></ui-icon>
      </header>
      <div layout="grow row content:center margin:0:1:4">
        <div layout="column grow width:::375px">
          <slot></slot>
        </div>
      </div>
    </template>
  `.css`
    #bg { transform: translateX(-50%); }

    #c-1 {
      background: radial-gradient(circle, #A1E4FF 0%, rgba(255,255,255,0.1) 70%);
      opacity: 0.4;
    }

    #c-2 {
      background: radial-gradient(circle, #3751D5 0%, rgba(255,255,255,0.1) 65%);
      opacity: 0.3;
    }

    header {
      color: var(--ui-color-primary-500);
    }

    @media (prefers-color-scheme: dark) {
      :host {
        background: var(--ui-color-gray-100);
      }

      #bg { display: none; }
    }
   `,
};

export { __vite_glob_0_3 as default };
