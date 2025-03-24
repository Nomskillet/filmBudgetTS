export function isTokenExpired(token: string): boolean {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload.exp;

    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return now > exp;
  } catch (err) {
    console.error('Invalid token format:', err);
    return true; // Treat as expired if anything goes wrong
  }
}
