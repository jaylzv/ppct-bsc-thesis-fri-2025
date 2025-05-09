import Log from '../store/log.js';
import Tab from '../store/tab.js';
import store from '../../../npm/hybrids/src/store.js';
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


function refreshSelectedTab(host) {
  chrome.tabs.reload(Number(host.tabId));
}

const Main = {
  logs: store([Log], {
    id: ({ tabId, query, status }) => ({ tabId, query, status }),
  }),
  tabs: store([Tab]),
  tabId: ({ tabs }, value) => {
    if (value !== undefined) return value;
    return store.ready(tabs) ? tabs.find((tab) => tab.active).id : '';
  },
  query: '',
  status: '',
  render: ({ logs, tabs, tabId, status }) => html`
    <template layout="height:full">
      <main layout="column gap height:full" translate="no">
        <div layout="row items:center gap padding:2:2:0">
          <ui-text type="label-l">Logger</ui-text>
          <ui-input layout="width:30">
            <select onchange="${html.set('tabId')}" value="${tabId}">
              <option value="">All tabs</option>
              ${store.ready(tabs) &&
              tabs.map(
                (tab) => html`
                  <option value="${tab.id}" selected=${tab.id === tabId}>
                    ${tab.title} ${tab.hostname}
                  </option>
                `,
              )}
            </select>
          </ui-input>
          <ui-input layout="grow">
            <input
              type="search"
              placeholder="Search..."
              oninput="${html.set('query')}"
            />
          </ui-input>
          <ui-input>
            <select onchange="${html.set('status')}" value="${status}">
              <option value="">All requests</option>
              <option value="touched">Blocked / Modified</option>
              <option value="warning">With warning</option>
            </select>
          </ui-input>
          <ui-button
            onclick="${refreshSelectedTab}"
            layout="width:5"
            disabled="${!tabId}"
          >
            <button title="Refresh current tab">
              <ui-icon name="refresh" layout="size:2"></ui-icon>
            </button>
          </ui-button>

          <ui-button onclick="${() => location.reload()}" layout="width:5">
            <button title="Clear logs and reload">
              <ui-icon name="trash" layout="size:2"></ui-icon>
            </button>
          </ui-button>
        </div>
        <ui-line></ui-line>
        <div layout="overflow:scroll">
          <div layout="column-reverse gap padding:0:2:2">
            ${store.error(logs)}
            ${store.ready(logs) &&
            logs.map((log) =>
              html`
                <div layout="grid:60px|60px|240px|60px|1 gap">
                  <ui-text type="body-s" color="gray-400">
                    ${log.time}
                  </ui-text>
                  <ui-text type="body-s" layout="self:center">
                    ${log.type}
                  </ui-text>
                  <ui-text type="body-s" color="gray-400" ellipsis>
                    ${log.filter}
                  </ui-text>
                  <div layout="row gap:0.5 center">
                    ${log.blocked &&
                    html`<ui-icon
                      name="block-s"
                      color="danger-700"
                      layout="size:2"
                    ></ui-icon>`}
                    ${log.modified &&
                    html`<ui-icon
                      name="eye"
                      color="primary-700"
                      layout="size:2"
                    ></ui-icon>`}
                    ${((log.filter && !log.blocked && !log.modified) ||
                      (!log.filter && (log.blocked || log.modified))) &&
                    html`<ui-icon
                      name="warning"
                      color="warning-500"
                      layout="size:2"
                    ></ui-icon>`}
                  </div>
                  <ui-text ellipsis>${log.url}</ui-text>
                </div>
              `.key(log.id),
            )}
          </div>
        </div>
      </main>
    </template>
  `.css`
    .blocked {
      color: var(--ui-color-danger-400);
    }
  `,
};

export { Main as default };
