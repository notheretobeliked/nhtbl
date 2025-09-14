import { P as Projects } from "../../../chunks/projects.js";
import { u as urqlQuery } from "../../../chunks/client.js";
import { e as error } from "../../../chunks/index.js";
const prerender = true;
const load = async function load2({ params }) {
  `/${params.all || ""}`;
  try {
    const data = await urqlQuery(Projects, { uri: "/portfolio" });
    if (data.page === null) {
      error(404, {
        message: "Not found"
      });
    }
    return {
      data
    };
  } catch (err) {
    const httpError = err;
    if (httpError.message) {
      error(httpError.status ?? 500, httpError.message);
    }
    error(500, err);
  }
};
export {
  load,
  prerender
};
