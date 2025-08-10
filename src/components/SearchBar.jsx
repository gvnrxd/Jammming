function SearchBar() {
  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <input placeHolder="Enter Song, Artist name Here" type="text"></input>
        <button>Search</button>
      </form>
    </>
  );
}

export default SearchBar;
