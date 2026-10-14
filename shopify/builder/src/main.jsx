import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

const roots = new WeakMap();
function mount() {
  const node = document.querySelector('[data-noor-root]');
  if (!node || roots.has(node)) return;
  const root = createRoot(node);
  roots.set(node, root);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
mount();
document.addEventListener('shopify:section:load', mount);
document.addEventListener('shopify:section:unload', event => {
  const node = event.target.querySelector('[data-noor-root]');
  const root = node && roots.get(node);
  if (root) { root.unmount(); roots.delete(node); }
});
