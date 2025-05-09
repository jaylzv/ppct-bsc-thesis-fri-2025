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


const __vite_glob_0_13 = {
  responsive: { value: false, reflect: true },
  render: () => html`
    <template layout="column gap">
      <header layout="padding:1.5" layout@768px="padding:1.5:2">
        <slot name="header"></slot>
      </header>
      <div layout="column gap" layout@768px="gap:0"><slot></slot></div>
    </template>
  `.css`
    header {
      background: var(--ui-color-gray-100);
      border-radius: 8px;
    }

    div ::slotted(*) {
      padding: 12px 14px;
      border-bottom: 1px solid var(--ui-color-gray-200);
    }

    :host([responsive]) div ::slotted(*) {
      border: 1px solid var(--ui-color-gray-200);
      border-radius: 8px;
    }

    @media screen and (min-width: 768px) {
      div ::slotted(*),
      :host([responsive]) div ::slotted(*) {
        padding: 24px 16px;
        border-radius: 0;
        border: none;
        border-bottom: 1px solid var(--ui-color-gray-200);
      }
    }
  `,
};

export { __vite_glob_0_13 as default };
