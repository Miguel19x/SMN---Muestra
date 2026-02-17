function getSecurityHeaders() {
  return {
    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",
    // Prevent clickjacking - deny all framing
    "X-Frame-Options": "DENY",
    // Enable XSS filter (legacy browsers)
    "X-XSS-Protection": "1; mode=block",
    // Referrer policy - don't leak full URLs
    "Referrer-Policy": "strict-origin-when-cross-origin",
    // Permissions policy - restrict browser features
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    // HSTS - force HTTPS (1 year, include subdomains)
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    // Content Security Policy
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.cloudflare.com https://images.nomassecuestros.com",
      "connect-src 'self' https://*.upstash.io https://*.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join("; ")
  };
}

export { getSecurityHeaders as g };
