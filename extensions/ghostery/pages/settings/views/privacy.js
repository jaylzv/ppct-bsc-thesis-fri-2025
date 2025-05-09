import { languages } from '../../../ui/labels.js';
import Options, { GLOBAL_PAUSE_ID } from '../../../store/options.js';
import Session from '../../../store/session.js';
import REGIONS from '../../../utils/regions.js';
import assets from '../assets/index.js';
import store from '../../../npm/hybrids/src/store.js';
import { html } from '../../../npm/hybrids/src/template/index.js';

function toggleNeverConsent({ options }) {
  store.set(options, {
    blockAnnoyances: !options.blockAnnoyances
  });
}
function updateGlobalPause({ options }, value, lastValue) {
  if (lastValue === void 0) return;
  store.set(options, {
    paused: {
      [GLOBAL_PAUSE_ID]: value ? { revokeAt: Date.now() + 24 * 60 * 60 * 1e3 } : null
    }
  });
}
function setRegion(id) {
  return ({ options }, event) => {
    const set = new Set(options.regionalFilters.regions);
    if (event.target.checked) {
      set.add(id);
    } else {
      set.delete(id);
    }
    store.set(options, { regionalFilters: { regions: [...set].sort() } });
  };
}
const __vite_glob_0_18 = {
  options: store(Options),
  session: store(Session),
  devMode: false,
  globalPause: {
    value: false,
    observe: updateGlobalPause
  },
  globalPauseRevokeAt: {
    value: ({ options }) => store.ready(options) && options.paused[GLOBAL_PAUSE_ID]?.revokeAt,
    observe: (host, value) => {
      host.globalPause = value;
    }
  },
  render: ({
    options,
    session,
    devMode,
    globalPause,
    globalPauseRevokeAt
  }) => html`
    <template layout="contents">
      <settings-page-layout layout="column gap:4">
        ${store.ready(options) && html`
          <section layout="column gap:4">
            <div layout="column gap" layout@992px="margin:bottom">
              <ui-text type="headline-m"> Privacy protection </ui-text>
              <ui-text type="body-l" mobile-type="body-m" color="gray-600">
                Ghostery protects your privacy by detecting and neutralizing
                different types of data collection including ads, trackers, and
                cookie pop-ups.
              </ui-text>
            </div>
            <ui-toggle
              value="${globalPause}"
              onchange="${html.set("globalPause")}"
              data-qa="toggle:global-pause"
            >
              <div layout="column gap:0.5 grow">
                <div layout="row gap items:center">
                  <ui-icon name="pause" color="gray-800"></ui-icon>
                  <ui-text type="headline-xs">Pause Ghostery</ui-text>
                </div>
                <ui-text type="body-m" mobile-type="body-s" color="gray-600">
                  Suspends privacy protection globally for 1 day.
                </ui-text>
                ${globalPauseRevokeAt && html`
                  <ui-text type="body-s" color="gray-600">
                    <ui-revoke-at
                      revokeAt="${globalPauseRevokeAt}"
                    ></ui-revoke-at>
                  </ui-text>
                `}
              </div>
            </ui-toggle>
            <ui-line></ui-line>
            <div
              layout="column gap:4"
              style="${{ opacity: globalPause ? 0.5 : void 0 }}"
            >
              <div layout="column gap:3">
                <ui-toggle
                  disabled="${globalPause}"
                  value="${options.blockAds}"
                  onchange="${html.set(options, "blockAds")}"
                  data-qa="toggle:ad-blocking"
                >
                  <div layout="column gap:0.5 grow">
                    <div layout="row gap items:center">
                      <ui-icon name="ads" color="gray-800"></ui-icon>
                      <ui-text type="headline-xs">Ad-Blocking</ui-text>
                    </div>
                    <ui-text
                      type="body-m"
                      mobile-type="body-s"
                      color="gray-600"
                    >
                      Eliminates ads on websites for safe and fast browsing.
                    </ui-text>
                  </div>
                </ui-toggle>
                <ui-toggle
                  disabled="${globalPause}"
                  value="${options.blockTrackers}"
                  onchange="${html.set(options, "blockTrackers")}"
                  data-qa="toggle:anti-tracking"
                >
                  <div layout="column grow gap:0.5">
                    <div layout="row gap items:center">
                      <ui-icon name="tracking" color="gray-800"></ui-icon>
                      <ui-text type="headline-xs">Anti-Tracking</ui-text>
                    </div>
                    <ui-text
                      type="body-m"
                      mobile-type="body-s"
                      color="gray-600"
                    >
                      Prevents various tracking techniques using AI-driven
                      technology.
                    </ui-text>
                  </div>
                </ui-toggle>
                <ui-toggle
                  disabled="${globalPause}"
                  value="${options.blockAnnoyances}"
                  onchange="${toggleNeverConsent}"
                  data-qa="toggle:never-consent"
                >
                  <div layout="column grow gap:0.5">
                    <div layout="row gap items:center">
                      <ui-icon name="autoconsent" color="gray-800"></ui-icon>
                      <ui-text type="headline-xs">Never-Consent</ui-text>
                    </div>
                    <ui-text
                      type="body-m"
                      mobile-type="body-s"
                      color="gray-600"
                    >
                      Automatically rejects cookie consent notices.
                    </ui-text>
                  </div>
                </ui-toggle>
              </div>
              <ui-line></ui-line>
              <div layout="column gap">
                <ui-toggle
                  disabled="${globalPause}"
                  value="${options.regionalFilters.enabled}"
                  onchange="${html.set(options, "regionalFilters.enabled")}"
                  data-qa="toggle:regional-filters"
                >
                  <div layout="column grow gap:0.5">
                    <div layout="row gap items:center">
                      <ui-icon name="pin" color="gray-800"></ui-icon>
                      <ui-text type="headline-xs">Regional Filters</ui-text>
                    </div>
                    <ui-text
                      type="body-m"
                      mobile-type="body-s"
                      color="gray-600"
                    >
                      Blocks additional ads, trackers, and pop-ups specific to
                      the language of websites you visit. Enable only the
                      languages you need to avoid slowing down your browser.
                    </ui-text>
                  </div>
                </ui-toggle>
                <div
                  hidden="${!options.regionalFilters.enabled}"
                  layout="grid:repeat(auto-fill,minmax(120px,1fr)) gap:2:1 margin:top"
                  layout[hidden]="hidden"
                >
                  ${REGIONS.map(
    (id) => html`
                      <settings-checkbox
                        disabled="${globalPause || !options.regionalFilters.enabled}"
                        layout="grow"
                        data-qa="checkbox:regional-filters:${id}"
                      >
                        <input
                          type="checkbox"
                          disabled="${!options.regionalFilters.enabled}"
                          checked="${options.regionalFilters.regions.includes(
      id
    )}"
                          onchange="${setRegion(id)}"
                        />
                        <span slot="label">
                          ${languages.of(id.toUpperCase())} (${id})
                        </span>
                      </settings-checkbox>
                    `
  )}
                </div>
              </div>
              <ui-toggle
                disabled="${globalPause}"
                value="${options.serpTrackingPrevention}"
                onchange="${html.set(options, "serpTrackingPrevention")}"
              >
                <div layout="column grow gap:0.5">
                  <div layout="row gap items:center">
                    <ui-icon
                      name="search"
                      color="gray-800"
                      layout="size:2"
                    ></ui-icon>
                    <ui-text type="headline-xs">
                      Search Engine Redirect Protection
                    </ui-text>
                  </div>
                  <ui-text type="body-m" mobile-type="body-s" color="gray-600">
                    Prevents Google from redirecting search result links through
                    their servers instead of linking directly to pages.
                  </ui-text>
                </div>
              </ui-toggle>
              <ui-line></ui-line>
              <div layout="column gap:3">
                <ui-text type="headline-xs" color="gray-600">Advanced</ui-text>
                <ui-toggle
                  disabled="${globalPause}"
                  value="${options.experimentalFilters}"
                  onchange="${html.set(options, "experimentalFilters")}"
                >
                  <div layout="column grow items:start gap:0.5">
                    <div layout="row gap items:center">
                      <ui-icon name="dots" color="gray-800"></ui-icon>
                      <ui-text type="headline-xs">
                        Experimental Filters
                      </ui-text>
                    </div>
                    <ui-text
                      type="body-m"
                      mobile-type="body-s"
                      color="gray-600"
                    >
                      Helps Ghostery fix broken pages faster. By activating you
                      can test experimental filters and support us with
                      feedback. Please send a message to support@ghostery.com
                      describing how your experience changed after enabling.
                    </ui-text>
                    <ui-text type="label-s" color="gray-600" underline>
                      <a
                        href="https://github.com/ghostery/broken-page-reports/blob/main/filters/experimental.txt"
                        target="_blank"
                        rel="noreferrer"
                        layout="row gap:0.5"
                      >
                        Learn more
                        <ui-icon name="arrow-right-s"></ui-icon>
                      </a>
                    </ui-text>
                  </div>
                </ui-toggle>
                <div layout="column gap">
                  <ui-toggle
                    disabled="${globalPause}"
                    value="${options.customFilters.enabled}"
                    onchange="${html.set(options, "customFilters.enabled")}"
                    data-qa="toggle:custom-filters"
                  >
                    <div layout="column gap:0.5">
                      <div layout="row gap items:center">
                        <ui-icon
                          name="detailed-view"
                          color="gray-800"
                        ></ui-icon>
                        <ui-text type="headline-xs">Custom Filters</ui-text>
                      </div>
                      <ui-text
                        type="body-m"
                        mobile-type="body-s"
                        color="gray-600"
                      >
                        Facilitates the creation of your own ad-blocking rules
                        to customize your Ghostery experience.
                      </ui-text>
                      <ui-text
                        type="label-s"
                        color="gray-600"
                        underline
                        layout="self:start"
                      >
                        <a
                          href="https://github.com/ghostery/adblocker/wiki/Compatibility-Matrix"
                          target="_blank"
                          rel="noreferrer"
                          layout="row gap:0.5"
                        >
                          Learn more on supported syntax
                          <ui-icon name="arrow-right-s"></ui-icon>
                        </a>
                      </ui-text>
                    </div>
                  </ui-toggle>
                  ${options.customFilters.enabled && html`
                    <div layout="column gap">
                      <div layout="self:start margin:bottom">
                        <settings-checkbox
                          disabled="${globalPause}"
                          data-qa="checkbox:custom-filters:trusted-scriptlets"
                        >
                          <input
                            type="checkbox"
                            disabled="${globalPause}"
                            checked="${options.customFilters.trustedScriptlets}"
                            onchange="${html.set(
    options,
    "customFilters.trustedScriptlets"
  )}"
                          />
                          <span slot="label">Allow trusted scriptlets</span>
                        </settings-checkbox>
                      </div>
                      <settings-custom-filters
                        disabled="${globalPause}"
                      ></settings-custom-filters>
                    </div>
                  `}
                </div>
              </div>
            </div>
          </section>

          <settings-devtools
            onshown="${html.set("devMode", true)}"
            visible="${devMode}"
          ></settings-devtools>
        `}
        ${store.ready(session) && html`
          <section
            layout="grid:1/1 grow items:end:stretch padding:0"
            layout@992px="hidden"
          >
            <settings-card
              layout="column items:center gap"
              layout@768px="row gap:5"
            >
              ${session.contributor ? html`
                    <img
                      src="${assets["contributor_badge"]}"
                      layout="size:12"
                      alt="Contribution"
                      slot="picture"
                    />
                    <div
                      layout="block:center column gap:0.5"
                      layout@768px="block:left row grow gap:5 content:space-between"
                    >
                      <div layout="column gap:0.5">
                        <ui-text type="label-l" layout="">
                          You are awesome!
                        </ui-text>
                        <ui-text type="body-s" color="gray-600">
                          Thank you for your support in Ghostery's fight for a
                          web where privacy is a basic human right!
                        </ui-text>
                      </div>
                    </div>
                  ` : html`
                    <img
                      src="${assets["hands"]}"
                      layout="size:12"
                      alt="Contribution"
                      slot="picture"
                    />
                    <div
                      layout="block:center column gap:0.5"
                      layout@768px="block:left row grow gap:5 content:space-between"
                    >
                      <div layout="column gap:0.5">
                        <ui-text type="label-l" layout="">
                          Become a Contributor
                        </ui-text>
                        <ui-text type="body-s" color="gray-600">
                          Help Ghostery fight for a web where privacy is a basic
                          human right.
                        </ui-text>
                      </div>
                      <ui-button type="primary" layout="grow margin:top">
                        <a
                          href="https://www.ghostery.com/become-a-contributor?utm_source=gbe"
                          target="_blank"
                        >
                          Become a Contributor
                        </a>
                      </ui-button>
                    </div>
                  `}
            </settings-card>
          </section>
        `}
      </settings-page-layout>
    </template>
  `
};

export { __vite_glob_0_18 as default };
