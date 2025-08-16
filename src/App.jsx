import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    (async () => {
      await handleRedirectIfPresent(); // stores token if code exists
      setToken(getStoredToken());
    })();
  }, []);
  useEffect(() => {
    if (!token) return;
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserProfile(data);
      })
      .catch((err) => console.error("Failed to fetch user profile", err));
  }, [token]);

  if (!token) {
    return <LoginPerms startAuth={startAuth} />;
  }

  console.log(userProfile);
  function handleLogout() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("expires_at");
    sessionStorage.removeItem("code_verifier");
    sessionStorage.removeItem("pkce_state");
    setToken(null);
    setUserProfile(null);
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, "", cleanUrl);
  }
  return (
    <>
      <PreLogin userProfile={userProfile} onLogout={handleLogout} />
      <h1 className="Logo">
        Jamming<span> playlist builder</span>
      </h1>
      <SearchBar />
      <div className="contentContainer">
        <SearchResults />
        <Playlist />
      </div>
    </>
  );
}
