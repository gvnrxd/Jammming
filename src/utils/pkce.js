// pkce.js

// ----- 1) Helpers -----
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
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI; // EXACT match (incl. trailing /)
const SCOPE =
  "user-read-private user-read-email playlist-modify-public playlist-modify-private";

const STORAGE = {
  verifier: "pkce_code_verifier",
  state: "pkce_state",
  handledCode: "pkce_handled_code",
  accessToken: "spotify_access_token",
};

// ----- 3) Start auth -----
export async function startAuth() {
  const codeVerifier = generateRandomString(64);
  sessionStorage.setItem(STORAGE.verifier, codeVerifier);

  const codeChallenge = base64url(await sha256(codeVerifier));
  const state = generateRandomString(16);
  sessionStorage.setItem(STORAGE.state, state);

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state,
  }).toString();

  console.log("AUTH →", authUrl.toString()); // sanity check redirect_uri
  window.location.assign(authUrl.toString());
}

// ----- 4) Exchange code for token -----
export async function exchangeCodeForToken(code) {
  const codeVerifier = sessionStorage.getItem(STORAGE.verifier);
  if (!codeVerifier) throw new Error("Missing PKCE code_verifier");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    code,
    redirect_uri: REDIRECT_URI, // MUST equal the one in startAuth
    code_verifier: codeVerifier,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  sessionStorage.setItem(STORAGE.accessToken, data.access_token);
  sessionStorage.removeItem(STORAGE.verifier);
  sessionStorage.removeItem(STORAGE.state);

  // clean query so the code can't be reused on refresh
  history.replaceState(null, "", location.pathname + location.hash);
  return data;
}

// ----- 5) Handle redirect (idempotent) -----
export async function handleRedirectIfPresent() {
  const qs = new URLSearchParams(location.search);
  const err = qs.get("error");
  if (err) throw new Error(`Spotify auth error: ${err}`);

  const code = qs.get("code");
  if (!code) return null;

  // prevent double exchange
  if (sessionStorage.getItem(STORAGE.handledCode) === code) {
    history.replaceState(null, "", location.pathname + location.hash);
    return null;
  }
  sessionStorage.setItem(STORAGE.handledCode, code);

  // state check
  const returnedState = qs.get("state");
  const expectedState = sessionStorage.getItem(STORAGE.state);
  if (!expectedState || returnedState !== expectedState) {
    throw new Error("State mismatch");
  }

  return exchangeCodeForToken(code);
}

export function getStoredToken() {
  return sessionStorage.getItem(STORAGE.accessToken);
}
