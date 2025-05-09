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


const __vite_glob_0_8 = {
  main: ({ render }) => render().querySelector('main'),
  render: () =>
    html`
      <template
        layout="column height:full"
        layout@992px="grid:280px|1:min|1"
        layout@1280px="grid:320px|1:min|1"
      >
        <header
          layout="row center gap padding:2 relative layer"
          layout@992px="padding:5:3 content:start"
        >
          <ui-icon name="logo" color="primary-500" layout="size:3"></ui-icon>
          <ui-text type="headline-s" color="primary-500">
            Ghostery settings
          </ui-text>
        </header>
        <nav
          layout="order:1 row content:space-around padding gap:0.5"
          layout@992px="grid:1:repeat(4,max-content)|max|1fr content:stretch padding:0:2:2 layer overflow:y:auto"
        >
          <slot name="nav"></slot>
        </nav>
        <main layout="column grow height::0" layout@992px="area::2">
          <slot></slot>
        </main>
      </template>
    `.css`
    :host {
      background: var(--ui-color-layout);
    }

    header, nav {
      background: var(--ui-color-layout);
      box-shadow: 0px 0px 80px rgba(32, 44, 68, 0.1);
    }

    header {
      border-bottom: 1px solid var(--ui-color-gray-200);
    }

    nav {
      border-top: 1px solid var(--ui-color-gray-200);
    }

    nav ::slotted(a) {
      box-sizing: border-box;
      display: flex;
      flex-flow: column;
      align-items: center;
      gap: 4px;
      color: var(--ui-color-gray-800);
      text-decoration: none;
      font: var(--ui-font-label-xs);
      text-overflow: ellipsis;
      overflow: hidden;
      flex: 1 1 0;
      max-width: 165px;
      border-radius: 6px;
      padding: 6px 4px 4px;
      text-align: center;
      --ui-color-nav: currentColor;
      transition: color 0.2s, opacity 0.2s;
    }

    @media (hover: hover) {
      nav ::slotted(a:hover) {
        color: var(--ui-color-primary-700);
        --ui-color-nav: currentColor;
      }
    }

    nav ::slotted(a:active) {
      opacity: 0.6;
    }

    nav ::slotted(a.active) {
      color: var(--ui-color-primary-700);
      background: var(--ui-color-primary-100);
    }

    nav ::slotted(a.wrap) {
      word-break: break-word;
    }

    @media screen and (min-width: 992px) {
      header, nav {
        box-shadow: none;
        border: none;
        border-right: 1px solid var(--ui-color-gray-200);
      }

      nav ::slotted(a) {
        font: var(--ui-font-label-l);
        gap: 8px;
        padding: 12px;
        flex: 0;
        flex-flow: row;
        max-width: none;
        text-align: left;
        --ui-color-nav: var(--ui-color-gray-600);
      }

      nav ::slotted(a.active) {
        --ui-color-nav: var(--ui-color-primary-700);
      }

      nav ::slotted(a.bottom) {
        position: relative;
        grid-row: 5;
        margin-top: 32px;
        overflow: visible;
      }

      nav ::slotted(a.bottom)::before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        bottom: calc(100% + 17px);
        height: 1px;
        background: var(--ui-color-gray-200);
      }
    }
  `,
};

export { __vite_glob_0_8 as default };
