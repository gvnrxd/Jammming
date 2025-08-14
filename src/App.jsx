import { useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
function App() {
  return (
    <>
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

export default App;
