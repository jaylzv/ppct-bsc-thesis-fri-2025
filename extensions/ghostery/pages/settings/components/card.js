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

const __vite_glob_0_2 = {
  inContent: { value: false, reflect: true },
  render: () => html`
    <template layout="column gap:3 padding:3" layout@768px="row items:center">
      <div><slot name="picture"></slot></div>
      <div layout="column gap:2 grow"><slot></slot></div>
    </template>
  `.css`
    :host {
      border: 1px solid var(--ui-color-gray-200);
      border-radius: 8px;
      box-shadow: 0px 2px 6px rgba(32, 44, 68, 0.08);
    }
  `,
};

export { __vite_glob_0_2 as default };
