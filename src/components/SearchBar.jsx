import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [q, setQ] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(q);
  }

  return (
    <form onSubmit={handleSubmit} className="searchForm">
      <input
        type="search"
        placeholder="Search songs or artists"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" disabled={loading || !q.trim()}>
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
