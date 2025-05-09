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


const __vite_glob_0_9 = {
  render: () => html`
    <template
      layout="column gap overflow:y:auto padding:4:2"
      layout@768px="padding:5:6"
      layout@992px="padding:6:3 area::2"
      layout@1280px="padding:8:3"
    >
      <slot layout::slotted(*)="width:full::760px self:center:start"></slot>
    </template>
  `,
};

export { __vite_glob_0_9 as default };
