import { useState } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onSearch, loading }) {
  const [q, setQ] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(q);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Search songs or artists"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
        className={styles.searchBar}
      />
      <button
        className={styles.searchButton}
        type="submit"
        disabled={loading || !q.trim()}
      >
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
