import React, { useEffect, useState, useRef } from "react";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import PreLogin from "./components/PreLogin";
import LoginPerms from "./components/LoginPerms";
import {
  handleRedirectIfPresent,
  getStoredToken,
  startAuth,
} from "./utils/pkce";

export default function App() {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [results, setResults] = useState({ tracks: [], artists: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);
  const [playlist, setPlaylist] = useState([]);

  // Finish OAuth redirect and load token
  useEffect(() => {
    (async () => {
      await handleRedirectIfPresent();
      setToken(getStoredToken());
    })();
  }, []);

  // Fetch current user profile once we have a token
  useEffect(() => {
    if (!token) return;
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUserProfile)
      .catch((err) => console.error("Failed to fetch user profile", err));
  }, [token]);

  // Abort any in-flight fetch on unmount
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  if (!token) return <LoginPerms startAuth={startAuth} />;

  function handleLogout() {
    [
      "access_token",
      "refresh_token",
      "expires_at",
      "code_verifier",
      "pkce_state",
    ].forEach((k) => sessionStorage.removeItem(k));
    setToken(null);
    setUserProfile(null);
    window.history.replaceState(
      null,
      "",
      window.location.origin + window.location.pathname
    );
  }

  async function searchSpotify(query) {
    const q = query.trim();
    const params = new URLSearchParams({
      q,
      type: "track,artist", // change to "track" if you only want tracks
      limit: "12",
    });

    // cancel previous request
    if (abortRef.current) abortRef.current.abort();
    const ctl = new AbortController();
    abortRef.current = ctl;

    const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: ctl.signal,
    });

    if (res.status === 401)
      throw new Error("TokenExpired: please reconnect Spotify");
    if (res.status === 429) {
      const retry = res.headers.get("retry-after") || "a few";
      throw new Error(`Rate limited. Try again in ${retry} seconds.`);
    }
    if (!res.ok) throw new Error(`Spotify search failed: ${res.status}`);

    const data = await res.json();
    return {
      tracks: data.tracks?.items ?? [],
      artists: data.artists?.items ?? [],
    };
  }

  async function handleSearchSubmit(query) {
    const q = query?.trim();
    if (!q) return;
    try {
      setLoading(true);
      setError("");
      const data = await searchSpotify(q);
      setResults(data);
    } catch (e) {
      setError(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function addToPlaylist(track) {
    setPlaylist((prev) => {
      // avoid duplicates by id
      if (prev.some((t) => t.id === track.id)) return prev;
      return [...prev, track];
    });
  }

  function removeFromPlaylist(trackId) {
    setPlaylist((prev) => prev.filter((t) => t.id !== trackId));
  }
  return (
    <>
      <PreLogin userProfile={userProfile} onLogout={handleLogout} />

      <h1 className="Logo">
        Jamming<span> playlist builder</span>
      </h1>

      <SearchBar onSearch={handleSearchSubmit} loading={loading} />

      {error && <p className="error">{error}</p>}

      <div className="contentContainer">
        <SearchResults results={results} onAdd={addToPlaylist} />
        <Playlist tracks={playlist} onRemove={removeFromPlaylist} />
      </div>
    </>
  );
}
