import { e as escape_html, j as store_get, u as unsubscribe_stores, a as pop, p as push } from "../../chunks/index2.js";
import { p as page } from "../../chunks/stores.js";
function _error($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out.push(`<h1>${escape_html(store_get($$store_subs ??= {}, "$page", page).error.message)}</h1>`);
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  pop();
}
export {
  _error as default
};
