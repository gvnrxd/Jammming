import React, { useEffect, useState, useRef } from "react";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import PreLogin from "./components/PreLogin";
import LoginPerms from "./components/LoginPerms";
import SubmitPlaylist from "./components/SubmitPlaylist";
import ConfirmModal from "./components/ConfirmModal";
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

  // separate errors so messages show in the right place
  const [searchError, setSearchError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState("");

  const abortRef = useRef(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState(null);

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

  // Not logged in view
  if (!token) return <LoginPerms startAuth={startAuth} />;

  // Logout clears both current + legacy keys and resets state
  function handleLogout() {
    const keys = [
      // current PKCE keys
      "spotify_access_token",
      "pkce_code_verifier",
      "pkce_state",
      "pkce_handled_code",
      // old keys you used before (safe to remove)
      "access_token",
      "refresh_token",
      "expires_at",
      "code_verifier",
    ];
    keys.forEach((k) => {
      sessionStorage.removeItem(k);
      localStorage.removeItem(k);
    });
    history.replaceState(null, "", location.pathname + location.hash);
    setToken(null);
    setUserProfile(null);
  }

  // ---- Search ----
  async function searchSpotify(query) {
    const q = query.trim();
    const params = new URLSearchParams({
      q,
      type: "track,artist",
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
      setSearchError("");
      const data = await searchSpotify(q);
      setResults(data);
    } catch (e) {
      setSearchError(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  // ---- Playlist add/remove ----
  function addToPlaylist(track) {
    setSubmitError(""); // clear submit error when user makes progress
    setPlaylist((prev) => {
      if (prev.some((t) => t.id === track.id)) return prev;
      return [...prev, track];
    });
  }

  function removeFromPlaylist(trackId) {
    setSubmitError("");
    setPlaylist((prev) => prev.filter((t) => t.id !== trackId));
  }

  // ---- Submit to Spotify ----
  async function handleSubmitPlaylist() {
    if (!token) {
      setSubmitError("Not connected to Spotify.");
      return;
    }

    const name = (playlistName || "").trim();
    if (!name) {
      setSubmitError("Please enter a playlist name before submitting.");
      return;
    }

    const uris = [...new Set(playlist.map((t) => t?.uri).filter(Boolean))];
    if (uris.length === 0) {
      setSubmitError("Add at least one track to your playlist.");
      return;
    }

    setSubmitError("");

    try {
      // 1) Create playlist for the current user
      const createRes = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          public: false,
          description: "Created with Jammming",
        }),
      });

      if (createRes.status === 401)
        throw new Error("Session expired. Please reconnect Spotify.");
      if (!createRes.ok)
        throw new Error(`Failed to create playlist (${createRes.status}).`);

      const created = await createRes.json();

      // 2) Add tracks in 100-item chunks
      for (let i = 0; i < uris.length; i += 100) {
        const chunk = uris.slice(i, i + 100);
        const addRes = await fetch(
          `https://api.spotify.com/v1/playlists/${created.id}/tracks`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris: chunk }),
          }
        );

        if (addRes.status === 401)
          throw new Error(
            "Session expired while adding tracks. Please reconnect."
          );
        if (addRes.status === 429) {
          const retry = addRes.headers.get("retry-after") || "a few";
          throw new Error(
            `Rate limited by Spotify. Try again in ${retry} seconds.`
          );
        }
        if (!addRes.ok)
          throw new Error(`Failed to add tracks (${addRes.status}).`);
      }

      // 3) Build summary BEFORE clearing local state
      const summary = playlist.map((t) => ({
        id: t.id,
        title: t.name,
        artists: t.artists?.map((a) => a.name).join(", ") || "",
        cover: t.album?.images?.[2]?.url || t.album?.images?.[1]?.url || "",
      }));

      // 4) Show confirmation modal
      setConfirmData({
        name,
        tracks: summary,
        playlistUrl: created?.external_urls?.spotify || "",
      });
      setConfirmOpen(true);

      // 5) Reset local state
      setPlaylist([]);
      setPlaylistName("");
    } catch (e) {
      setSubmitError(e.message || "Submit failed. Please try again.");
    }
  }

  return (
    <main className="App">
      <h1 className="Logo">
        Jamming<span> playlist builder</span>
      </h1>

      {/* user chip / logout */}
      <PreLogin userProfile={userProfile} onLogout={handleLogout} />

      {/* search */}
      <SearchBar onSearch={handleSearchSubmit} loading={loading} />
      {searchError && <p className="error">{searchError}</p>}

      {/* 3-column content */}
      <div className="contentContainer">
        <SearchResults results={results} onAdd={addToPlaylist} />

        <Playlist
          tracks={playlist}
          onRemove={removeFromPlaylist}
          /* no name field here; it lives in SubmitPlaylist */
        />

        <SubmitPlaylist
          name={playlistName}
          onNameChange={(val) => {
            setPlaylistName(val);
            if (submitError) setSubmitError("");
          }}
          onSubmit={handleSubmitPlaylist}
          disabled={!playlistName.trim() || playlist.length === 0}
          error={submitError}
        />
      </div>
      <ConfirmModal
        open={confirmOpen}
        data={confirmData}
        onClose={() => setConfirmOpen(false)}
      />
    </main>
  );
}
