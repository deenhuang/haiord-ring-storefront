# HAIORD Ring Shopify Theme

This folder contains a Shopify Online Store 2.0 theme in `theme/` and the local build source in `builder/`.

## Upload

Upload `HAIORD-Ring-Shopify-theme.zip` in Shopify Admin > Online Store > Themes > Import theme > Upload zip file. Preview it before publishing.

## What Is Included

- Home page with the HAIORD Ring bilingual presale experience.
- Product, collection, cart, page, and 404 templates using Liquid.
- Original product images and English/Chinese videos in theme assets.
- Native product and cart forms on their respective Shopify pages.

## Important Boundaries

- The home-page reservation interaction is a frontend preview. It does not create orders, reserve inventory, collect deposits, or send customer data. Do not advertise it as a live checkout.
- Actual product prices and currency conversion on Shopify product/cart pages come from Shopify products and Markets settings, not from the home-page preview figures. Configure these separately before publishing.
- The home page is a bundled React section inside a Liquid theme. The theme editor exposes accent colors, but its text and pricing are not editable through theme settings. Edit `builder/src/` and rebuild to change those.
- Shopify store authentication and a live merchant preview were not available here. The package passed Shopify Theme Check and local browser smoke tests, but should be previewed in your store before publishing.

## Rebuild Home Page

From `builder/`, install dependencies with `npm ci` if needed, then run `npx vite build --config vite.config.mjs`. The compiled JS and CSS are written into `theme/assets/`. Re-run `shopify theme check --path theme` and `shopify theme package --path theme` afterward.
