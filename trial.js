class Trial {
    constructor() {
        this.CONTAINER_ID = '_____origin-trial-info';
        this.ORIGIN_TRIAL_API_ENDPIONT = 'https://content-chromeorigintrials-pa.googleapis.com/v1/trials?prettyPrint=false&key='
        this.RUNTIME_FEATURES = 'https://raw.githubusercontent.com/chromium/chromium/main/third_party/blink/renderer/platform/runtime_enabled_features.json5';
        this.originTrialJson = null;
        this.runtimeFeatureJson = null;
    }
    getTrialId() {
        const match = location.hash.match(/\/register_trial\/(-?[0-9]+)/) || location.hash.match(/\/view_trial\/(-?[0-9]+)/);
        if (!match || !match[1]) {
            return null;
        }
        return match[1];
    }
    addInfo(trialId, feature) {
        const container = document.createElement('div');
        container.setAttribute('trial-id', trialId);
        container.id = this.CONTAINER_ID;
        container.style.width = '100%';
        container.style.height = '1px';
        container.style.backgroundColor = 'transparent';
        container.style.position = 'fixed';
        container.style.top = '0px';
        container.style.left = '0px';
        container.style.fontFamily = 'sans-serif';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        const info = document.createElement('div');
        info.style.padding = '10px';
        info.style.backgroundColor = '#d7003a';
        info.style.color = 'white';
        info.style.borderRadius = '3px';
        info.style.boxShadow = '0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%)';
        info.style.marginTop = '60px';
        info.innerHTML = `ℹ️  This origin trial works only on <b>${feature.origin_trial_os.join(", ")}</b>`;
        container.appendChild(info);
        document.body.appendChild(container);
    }
    async getTrialDetails() {
        const trialId = this.getTrialId();
        // Check if information banner already exists
        const info = document.getElementById(this.CONTAINER_ID);
        if (info) {
            if (info.getAttribute('trial-id') === trialId) {
                return;
            }
            document.body.removeChild(info);
        }
        // Check the route
        if (!trialId) {
            return;
        }
        // Check if the origin trial information is cached
        if (!this.originTrialJson) {
            const apiKey = document.querySelector('ot-app[api-key]').getAttribute('api-key');
            if (!apiKey) {
                return;
            }
            this.originTrialJson = await (await fetch(`${this.ORIGIN_TRIAL_API_ENDPIONT}${apiKey}`)).json();
        }

        this.originTrialJson.trials.forEach(async trial => {
            if (trial.id === trialId) {
                // Check if the runtime features are cached
                if (!this.runtimeFeatureJson) {
                    const runtimeFeaturesText = await (await fetch(this.RUNTIME_FEATURES)).text();
                    this.runtimeFeatureJson = JSON5.parse(runtimeFeaturesText);
                }
                this.runtimeFeatureJson.data.forEach(feature => {
                    if (feature.name === trial.originTrialFeatureName
                        || feature.origin_trial_feature_name === trial.originTrialFeatureName) {
                        /**
                         * For now, only show supported OS
                         */
                        if (!feature.origin_trial_os) {
                            return;
                        }
                        this.addInfo(trialId, feature);
                    }
                })
            }
        });
    }
}

// To cache fetch results, create instance once
const trial = new Trial();
// https://developer.chrome.com/origintrials/
// is using https://www.webcomponents.org/element/@polymer/app-route
window.addEventListener('location-changed', (evt) => {
    trial.getTrialDetails();
});

// run
trial.getTrialDetails();
