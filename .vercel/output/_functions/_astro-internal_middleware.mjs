import { g as getSecurityHeaders } from './chunks/securityHeaders_DSa4Cs-i.mjs';
import './chunks/astro-designed-error-pages_B5XrIqMF.mjs';
import './chunks/astro/server_CJfq-tyP.mjs';
import 'clsx';
import { s as sequence } from './chunks/index_BrT50vZd.mjs';

const onRequest$1 = async (context, next) => {
  const response = await next();
  const securityHeaders = getSecurityHeaders();
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
};

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
