import React, { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import {
  handleRedirectIfPresent,
  getStoredToken,
  startAuth,
} from "./utils/pkce";

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    (async () => {
      await handleRedirectIfPresent(); // stores token if code exists
      setToken(getStoredToken());
    })();
  }, []);

  if (!token) {
    return <button onClick={startAuth}>Connect Spotify</button>;
  }

  return (
    <>
      <div>Connected! Ready to search.</div>
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
