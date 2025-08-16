// pkce.js

// ----- 1) Helpers: random, sha256, base64url -----
export function generateRandomString(len = 64) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const r = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(r, (v) => chars[v % chars.length]).join("");
}

export async function sha256(plain) {
  const data = new TextEncoder().encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

export function base64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// ----- 2) Config -----
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI; // EXACT match with dashboard
const SCOPE = "user-read-private user-read-email";

const STORAGE = {
  verifier: "pkce_code_verifier",
  accessToken: "spotify_access_token",
};

// ----- 3) Build the authorize URL and redirect (startAuth) -----
export async function startAuth() {
  // 3a. Create + store verifier
  const codeVerifier = generateRandomString(64);
  sessionStorage.setItem(STORAGE.verifier, codeVerifier);

  // 3b. Create challenge from verifier
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64url(hashed);

  // 3c. Build the /authorize URL
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    // optional: state: generateRandomString(16),
  }).toString();

  // 3d. Go to Spotify’s consent/login
  window.location.assign(authUrl.toString());
}

// ----- 4) Token exchange -----
export async function exchangeCodeForToken(code) {
  const codeVerifier = sessionStorage.getItem(STORAGE.verifier);
  if (!codeVerifier) throw new Error("Missing PKCE code_verifier");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Token exchange failed: ${res.status} ${JSON.stringify(err)}`
    );
  }

  const data = await res.json();
  sessionStorage.setItem(STORAGE.accessToken, data.access_token);
  sessionStorage.removeItem(STORAGE.verifier); // verifier no longer needed

  // Clean "?code=..." from URL so refreshes are safe
  window.history.replaceState({}, "", window.location.pathname);

  return data; // contains access_token, expires_in, etc.
}

// ----- 5) Convenience helpers -----
export function getStoredToken() {
  return sessionStorage.getItem(STORAGE.accessToken);
}

export async function handleRedirectIfPresent() {
  const qs = new URLSearchParams(window.location.search);
  const error = qs.get("error");
  if (error) throw new Error(`Spotify auth error: ${error}`);
  const code = qs.get("code");
  if (!code) return null;
  return exchangeCodeForToken(code);
}
