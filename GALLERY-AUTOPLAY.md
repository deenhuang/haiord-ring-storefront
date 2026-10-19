# Product gallery autoplay and compact controls

The four product images advance every five seconds. The bottom-right translucent control group contains previous/next arrows, clickable position dots, and a progress pill for the active slide, following the user's selected Oura reference. English/Chinese playback controls remain available. Existing thumbnails and the product-video entry are retained.

The outgoing image remains above the incoming image until it has decoded, then fades over 700 ms. Hover, keyboard focus, offscreen/hidden pages, and open modals pause playback. Pausing preserves elapsed slide time; resuming continues the remaining progress. Reduced-motion preferences start playback paused and remove image transitions.

`shopify/theme/assets/noor-gallery.js` and `.css` are shared by the Shopify layout and standalone storefront. Gallery controls use the storefront's existing Lucide arrow icon. No rebuild of the current production React bundle is required for the control update.

## Validation

Install root development dependencies and run `node --test tests/gallery.test.mjs`. Fourteen DOM tests passed. Playwright verified the actual uploaded preview theme at desktop (1440 x 1100) and mobile (390 x 844) sizes, including English/Chinese labels, autoplay, visible progress, pause, dot navigation, arrows, bounds, and no horizontal overflow. No uncaught page errors occurred. Shopify Shop iframe CSP and external 403/404 messages were observed in the console; exercised gallery assets loaded successfully.

The Shopify toolkit theme validator could not run because its bundled theme-check dependency is missing. JavaScript syntax, DOM tests, browser interactions, and visual control comparison passed.

## App-feature copy

Qibla compass and prayer reminders are described as available HAIORD app features in English and Chinese, including their labels and related FAQ. Hardware-capability qualifications remain unchanged.

## Preorder messaging

The production product status is COMING SOON · PRE-ORDER NOW / 即将发售 · 预购开启. The production primary CTA is Pre-order now / 立即预购. Existing cart and checkout behavior is unchanged. English/Chinese status and CTA text were verified in the actual latest preview, including mobile overflow checks.

## Shopify preview and publishing

Latest combined preview: `HAIORD Preorder Copy Update` (193359380844), duplicated from the current live gallery-controls theme so it retains the gallery controls and app-feature copy.

- English: https://haiord.com/en?preview_theme_id=193359380844#overview
- Chinese: https://haiord.com/?preview_theme_id=193359380844&language=zh#overview

Publishing the draft must be completed in Shopify admin. GitHub PR changes alone do not publish Shopify. The older repository theme differs from production; the control and copy changes were applied to their respective existing baselines. Do not replace production with the older repository theme without reconciling the other differences. The existing root theme ZIP has not been regenerated from that older baseline.
