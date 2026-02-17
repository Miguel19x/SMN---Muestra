const SECRET_KEY = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

async function verifyTurnstileToken(token, ip) {
  const formData = new FormData();
  formData.append("secret", SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", ip);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });

  return result.json();
}

export { verifyTurnstileToken as v };
