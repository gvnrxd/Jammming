import styles from "./SearchBar.module.css";
function SearchBar() {
  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          className={styles.searchBar}
          placeholder="Enter Song, Artist name Here"
          type="text"
        />
        <button className={styles.searchButton}>Search</button>
      </form>
    </>
  );
}

export default SearchBar;
