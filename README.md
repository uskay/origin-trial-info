# Origin Trial Info Extension
## What is this tool for?
An extension to add additional important information in [https://developer.chrome.com/origintrials/](https://developer.chrome.com/origintrials/). The current site does not show the full information of the origin trial (OT) and there are some important ones (likely caveats) that should be notified before registration. The current version supports adding information below:
- **OS Support:** Checks OT's supported OS and add that information in the page if there's any noteworthy limitations (if the OT supports all the OSes, it won't show anything)

## How to use
1. Install the extension from your local via [the developer mode](https://developer.chrome.com/docs/extensions/mv2/getstarted/#:~:text=The%20directory%20holding%20the%20manifest%20file%20can%20be%20added%20as%20an%20extension%20in%20developer%20mode%20in%20its%20current%20state.)
2. Visit [https://developer.chrome.com/origintrials/](https://developer.chrome.com/origintrials/)
3. Select the active trials
4. If the origin trial had any noteworthy addtional information, you can check that on the top of the page (check out [Prerender2](https://developer.chrome.com/origintrials/#/view_trial/1325184190353768449) for example)

![](https://cdn.glitch.global/d1d49b49-541b-4e26-8cd5-f7fa3a45e1aa/OriginTrialInfoExtension.png?v=1647524708012)

## How it is implemented
Super simple
- fetch https://content-chromeorigintrials-pa.googleapis.com/v1/trials
- get `originTrialFeatureName`
- match it with https://raw.githubusercontent.com/chromium/chromium/main/third_party/blink/renderer/platform/runtime_enabled_features.json5
- get & show additional data

## Licence
Codes are Apache 2.0
