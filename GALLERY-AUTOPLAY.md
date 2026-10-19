# Product gallery autoplay

The four product images advance every five seconds. Existing arrows, thumbnails, and selected-image state stay in sync because autoplay uses the gallery's existing next button. The outgoing image remains above the new image until it has decoded, then fades out over 700 ms.

Autoplay pauses while hovered, focused, outside the viewport, in a hidden tab, or while a modal is open. A localized English/Chinese button lets visitors pause it. Reduced-motion preferences disable autoplay initially and remove the fade.

`shopify/theme/assets/noor-gallery.js` and `.css` are shared by the Shopify layout and standalone storefront. The script initializes asynchronously rendered galleries and cleans up galleries removed by the theme editor. No rebuild of the existing production React bundle is required.

## Validation

Install root development dependencies, then run `node --test tests/gallery.test.mjs`. Eleven DOM tests cover looping, hover, English/Chinese controls, image loading, modal pause, reduced motion, keyboard focus, page visibility, cleanup, and live language changes.

The Shopify toolkit theme validator could not run because its bundled `@shopify/theme-check-common` dependency is missing. JavaScript syntax validation and DOM tests passed. Visual browser QA remains pending because computer-control permission was unavailable.

## Shopify preview

Draft theme: `HAIORD Smooth Autoplay Preview` (193356988780), duplicated from the current live theme. Its two new assets and modified layout were uploaded and read back byte-for-byte. The live theme remains unchanged because the Shopify connector blocks live-theme writes and publishing.

- English: https://haiord.com/en?preview_theme_id=193356988780#overview
- Chinese: https://haiord.com/?preview_theme_id=193356988780&language=zh#overview

The existing GitHub theme is older than production. The layout in this change preserves the repository baseline and only adds the two gallery asset references. The draft theme instead preserves its current production layout. Do not deploy the old repository theme over production without reconciling the remaining differences. The existing root ZIP was not regenerated from this older baseline.

## Publishing

Review and merge the feature branch before updating the repository baseline. Publishing the preview theme must be completed in Shopify admin. Repository integration changes alone do not publish the Shopify preview theme.
