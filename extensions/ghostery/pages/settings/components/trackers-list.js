import { categories } from '../../../ui/labels.js';
import { html } from '../../../npm/hybrids/src/template/index.js';
import { dispatch } from '../../../npm/hybrids/src/utils.js';
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


const __vite_glob_0_14 = {
  name: '',
  description: '',
  size: 0,
  adjusted: 0,
  blocked: 0,
  trusted: 0,
  blockedByDefault: false,
  open: { value: false, reflect: true },
  render: ({ name, size, adjusted, open, blockedByDefault }) => html`
    <template layout="column gap:2 padding:1.5">
      <header layout="row items:center gap:1.5" layout@768px="gap:2">
        <ui-action>
          <button
            onclick="${(host) => dispatch(host, 'toggle')}"
            layout="block:left row items:center gap:1.5 padding:0.5 grow"
            layout@768px="gap:2"
          >
            <ui-icon
              id="arrow"
              name="arrow-down"
              layout="size:3"
              color="gray-600"
            ></ui-icon>
            <ui-category-icon
              name="${name}"
              layout="size:5 padding"
            ></ui-category-icon>
            <div layout="column gap:0.5">
              <ui-text type="label-l">${categories[name]}</ui-text>
              <div layout="column" layout@768px="row gap">
                <ui-text type="body-s" color="gray-600" layout="width::90px">
                  Activities<span>:</span> ${size}
                </ui-text>
                ${!!adjusted &&
                html`
                  <ui-text type="body-s" color="gray-600" layout="width::90px">
                    <!-- | tracker-list -->Adjusted<span>:</span> ${adjusted}
                  </ui-text>
                `}
              </div>
            </div>
          </button>
        </ui-action>

        <ui-tooltip>
          <span slot="content">
            ${blockedByDefault
              ? msg`Block all (recommended)`
              : msg`Trust all (recommended)`}
          </span>
          <ui-action-button layout="width:4.5">
            <button onclick="${(host) => dispatch(host, 'clear')}">
              <ui-icon name="refresh"></ui-icon>
            </button>
          </ui-action-button>
        </ui-tooltip>
      </header>

      ${open && html`<slot></slot> `}
    </template>
  `.css`
    :host {
      border-radius: 8px;
      border: 1px solid var(--ui-color-gray-200);
      background: var(--ui-color-layout);
    }

    :host([open]) #arrow {
      transform: rotate(180deg);
    }
  `,
};

export { __vite_glob_0_14 as default };
