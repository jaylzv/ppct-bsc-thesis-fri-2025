import TrackerException from './tracker-exception.js';
import { getSimilarTrackers, getTracker } from '../utils/trackerdb.js';
import store from '../npm/hybrids/src/store.js';

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


const Tracker = {
  id: true,
  name: '',
  category: '',
  categoryDescription: '',
  exception: TrackerException,
  organization: {
    id: true,
    name: '',
    description: '',
    country: '',
    contact: '',
    websiteUrl: '',
    privacyPolicyUrl: '',
  },
  blockedByDefault: false,
  adjusted: ({ exception, blockedByDefault }) =>
    store.ready(exception) &&
    (exception.blocked !== blockedByDefault ||
      exception.blockedDomains.length > 0 ||
      exception.trustedDomains.length > 0),
  [store.connect]: {
    async get(id) {
      // Load exceptions to memory
      await store.resolve([TrackerException]);

      return getTracker(id);
    },
    list: ({ tracker: id }) => getSimilarTrackers(id),
  },
};

export { Tracker as default };
