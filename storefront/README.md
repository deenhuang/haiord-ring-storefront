# HAIORD Ring Storefront

A standalone React + Vite bilingual presale frontend for HAIORD Ring (元序智能戒指). It is separate from the existing app demo and does not overwrite it.

## Run

```sh
npm install
npm run dev -- --host 0.0.0.0 --port 5180
```

## Verify

```sh
node --test tests/pricing.test.mjs
npm run build
```

## Included

- Product gallery, four finishes, size guide, quantity and sizing-kit selection.
- Chinese/English switching, with a browser-local language preference.
- English pricing: $349 retail, $199 early bird with a $30 reservation deposit.
- Chinese pricing: CNY 2,399 retail, CNY 1,399 early bird with a CNY 199 deposit.
- Chinese product-film entry points play the supplied Chinese video; English product-film entry points retain the English video.
- Larger typography inspired by Cybopal: 18px desktop body and 48-56px section/product headings.
- Reservation form validation and local-only completion state.
- Original product video assets transcoded to H.264 for browser compatibility.
- Lifestyle imagery extracted from the supplied English product brochure.
- Wellness feature sections, planned app Qibla compass and prayer reminders.
- Responsive navigation, FAQ, and privacy/terms preview.

## Before Publication

This is not a transactional store. No payment provider, database, email delivery, authentication, analytics or order API is connected. Form data is not transmitted or persisted. A completed preview is not a real reservation.

Confirm sizes, stock, subscription terms, deposit credits/refunds, shipping fees/dates, taxes, warranty, production specifications and privacy policy before enabling paid orders. Qibla and prayer reminders are explicitly marked as planned app features, not hardware capabilities.

Weight, dimensions and the water-resistance rating are brochure claims, not independently verified specifications. No medical, injury-prevention or accuracy guarantee is made. Confirm rights to publish supplied media before public launch.

## Static Hosting

Build for the root of a static site with `npm run build`, then publish `dist/client`. For a subpath deployment, set the existing `NOOR_BASE_PATH` environment variable before building, for example:

```sh
NOOR_BASE_PATH=/your-repository/ npm run build
```
