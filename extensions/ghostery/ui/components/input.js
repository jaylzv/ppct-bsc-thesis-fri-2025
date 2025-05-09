import { html } from '../../npm/hybrids/src/template/index.js';

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


const __vite_glob_0_10 = {
  icon: { value: '', reflect: true },
  error: { value: '', reflect: true },
  render: ({ icon, error }) => html`
    <template layout="column gap:0.5 relative">
      ${icon &&
      html`
        <div layout="row center absolute inset left:12px right:auto">
          <ui-icon name="${icon}" color="gray-400" layout="size:3"></ui-icon>
        </div>
      `}
      <slot></slot>
      ${error &&
      html`<ui-text color="danger-500" type="body-s">${error}</ui-text>`}
    </template>
  `.css`
    :host {
      font: var(--ui-font-body-l);
    }

    ::slotted(input),
    ::slotted(textarea),
    ::slotted(select) {
      box-sizing: border-box;
      background: var(--ui-color-layout);
      border: 1px solid var(--ui-color-gray-200);
      border-radius: 8px;
      padding: 0 11px;
      margin: 0;
      color: var(--ui-color-gray-800);
      box-shadow: 0px 2px 6px rgba(32, 44, 68, 0.08);
    }

    ::slotted(input) {
      font: var(--ui-font-body-l);
      height: 40px;
    }

    ::slotted(input[type="checkbox"]) {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      border: 1px solid var(--ui-color-gray-300);
      background-color: var(--ui-color-gray-100);
      background-repeat: no-repeat;
      background-position: center;
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
      padding: 0;
    }

    ::slotted(input[type="checkbox"]:checked) {
      background-color: var(--ui-color-primary-500);
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 3L4.5 8.5L2 6' stroke='white' stroke-width='1.6666' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
      border-color: var(--ui-color-primary-500);
    }

    @media (prefers-color-scheme: dark) {
      ::slotted(input[type="checkbox"]:checked) {
        background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 3L4.5 8.5L2 6' stroke='%23202225' stroke-width='1.6666' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
      }
    }

    ::slotted(input[type="checkbox"]:active) {
      opacity: 0.5;
    }

    ::slotted(textarea) {
      padding: 8px;
      font: var(--ui-font-body-s);
      font-family: monospace;
      color: var(--ui-color-gray-800);
    }

    ::slotted(select) {
      height: 40px;
      appearance: none;
      font: var(--ui-font-label-m);
      background: no-repeat right 7px center / 16px 16px;
      background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%23202C44' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
      padding-right: 28px;
    }

    @media (hover: hover) {
      ::slotted(input:hover),
      ::slotted(textarea:hover),
      ::slotted(select:hover) {
        border-color: var(--ui-color-gray-300);
      }
    }

    @media (prefers-color-scheme: dark) {
      ::slotted(select) {
        background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%23eceff5' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
      }
    }

    ::slotted(input)::placeholder,
    ::slotted(select)::placeholder {
      color: var(--ui-color-gray-400);
    }

    :host([icon]) ::slotted(input) {
      padding-left: 44px;
    }

    :host([error]) ::slotted(input) {
      border-color: var(--ui-color-danger-500);
    }

    @media screen and (min-width: 768px) {
      ::slotted(input) {
        font: var(--ui-font-body-m);
      }
    }
  `,
};

export { __vite_glob_0_10 as default };
