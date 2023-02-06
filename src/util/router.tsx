//Based on https://github.com/adamziel/react-router-named-routes/blob/61974fa2e17e95bc26559c49c955cf61e77fc2ec/lib/index.js
import {Dict} from "./customTypes";

const reRepeatingSlashes = /\/+/g; // "/some//path"
const reSplatParams = /\*{1,2}/g;  // "/some/*/complex/**/path"
const reResolvedOptionalParams = /\(([^:*?#]+?)\)/g; // "/path/with/(resolved/params)"
const reUnresolvedOptionalParams = /\([^:?#]*:[^?#]*?\)/g; // "/path/with/(groups/containing/:unresolved/optional/:params)"
const reUnresolvedOptionalParamsRR4 = /(\/[^/]*\?)/g; // "/path/with/groups/containing/unresolved?/optional/params?"
const reTokens = /<(.*?)>/g;
const reSlashTokens = /_!slash!_/g;

function formatRoute(routePath: string, params?: Dict<string> | undefined, splat?: string[] | undefined) {
  let tokens: Dict<string> = {};

  if (params) {
    for (const paramName in params) {
      const paramValue = params[paramName];
      if (paramValue !== undefined) {
        // Roughly resolve all named placeholders.
        // Cases:
        // - "/path/:param"
        // - "/path/(:param)"
        // - "/path(/:param)"
        // - "/path(/:param/):another_param"
        // - "/path/:param(/:another_param)"
        // - "/path(/:param/:another_param)"
        const paramRegex = new RegExp('(/|\\(|\\)|^):' + paramName + '(/|\\)|\\(|$)');
        routePath = routePath.replace(paramRegex, (match, g1, g2) => {
          tokens[paramName] = encodeURIComponent(paramValue);
          return `${g1}<${paramName}>${g2}`;
        });
        const paramRegexRR4 = new RegExp('(.*):' + paramName + '\\?(.*)');
        routePath = routePath.replace(paramRegexRR4, (match, g1, g2) => {
          tokens[paramName] = encodeURIComponent(paramValue);
          return `${g1}<${paramName}>${g2}`;
        });
      }

      if (splat) { // special param name in RR, used for "*" and "**" placeholders
        let i = 0;
        routePath = routePath.replace(reSplatParams, (match) => {
          const val = splat[i++];
          if (val == null) {
            return "";
          } else {
            const tokenName = `splat${i}`;
            tokens[tokenName] = match === "*"
                ? encodeURIComponent(val)
                // don't escape slashes for double star, as "**" considered greedy by RR spec
                : encodeURIComponent(val.toString().replace(/\//g, "_!slash!_")).replace(reSlashTokens, "/");
            return `<${tokenName}>`;
          }
        });
      } else {
      }
    }
  }

  return routePath
      // Remove braces around resolved optional params (i.e. "/path/(value)")
      .replace(reResolvedOptionalParams, "$1")
      // Remove all sequences containing at least one unresolved optional param
      .replace(reUnresolvedOptionalParams, "")
      // Remove all sequences containing at least one unresolved optional param in RR4
      .replace(reUnresolvedOptionalParamsRR4, "")
      // After everything related to RR syntax is removed, insert actual values
      .replace(reTokens, (match, token) => tokens[token] as string)
      // Remove repeating slashes
      .replace(reRepeatingSlashes, "/")
      // Always remove ending slash for consistency
      .replace(/\/+$/, "")
      // If there was a single slash only, keep it
      .replace(/^$/, "/");
}

export {formatRoute}