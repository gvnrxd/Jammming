import styles from "./SearchResults.module.css";
function SearchResults() {
  return (
    <>
      <div className="panelContainer">
        <h2>Search Results</h2>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
        </ul>
        <p className={styles.searchTip}>
          Tip: Click + To add a track to your playlist
        </p>
      </div>
    </>
  );
}
export default SearchResults;
