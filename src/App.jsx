import { useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
function App() {
  return (
    <>
      <h1>Welcome To Jamming</h1>
      <SearchBar />
      <SearchResults />
      <Playlist />
    </>
  );
}

export default App;
