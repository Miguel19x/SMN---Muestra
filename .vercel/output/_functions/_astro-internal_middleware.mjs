import { g as getSecurityHeaders } from './chunks/securityHeaders_B-pWwsKs.mjs';
import './chunks/astro-designed-error-pages_BvcEY9U8.mjs';
import './chunks/astro/server_D0FKrmaD.mjs';
import 'clsx';
import { s as sequence } from './chunks/index_BikaTQql.mjs';

const onRequest$1 = async (_context, next) => {
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
