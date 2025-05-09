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


const __vite_glob_0_12 = {
  revokeAt: undefined,
  render: ({ revokeAt }) => html`
    <template layout="row items:center gap">
      ${revokeAt === undefined
        ? html`
            <settings-badge type="info" uppercase> Active </settings-badge>
          `
        : html`
            <settings-badge type="warning" uppercase> Paused </settings-badge>
            <ui-text color="gray-600" layout="grow">
              <ui-revoke-at revokeAt="${revokeAt}"></ui-revoke-at>
            </ui-text>
          `}
    </template>
  `,
};

export { __vite_glob_0_12 as default };
