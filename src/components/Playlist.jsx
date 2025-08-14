import styles from "./Playlist.module.css";
function Playlist() {
  return (
    <>
      <div className="panelContainer">
        <h2>Playlist</h2>
        <input
          placeholder="Playlist name"
          className={styles.playlistInput}
        ></input>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
        </ul>
        <button className={styles.playlistButton}>Save to Spotify</button>
      </div>
    </>
  );
}
export default Playlist;
