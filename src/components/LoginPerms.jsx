import styles from "./LoginPerms.module.css";
function LoginPerms({ startAuth }) {
  return (
    <>
      <div className={styles.permsBox}>
        <div className={styles.contentBox}>
          <p>
            To build and save your playlists, this app needs permission to
            connect with your Spotify account. This allows us to:
          </p>
          <ul>
            <li>
              See your Spotify username and basic profile (so we can show you’re
              signed in)
            </li>
            <li>
              Access your playlists (so you can create and edit them here)
            </li>
            <li>
              Search Spotify’s music library (so you can find songs to add)
            </li>
          </ul>
          <p>
            We will <strong>never</strong> change your account, listen history,
            or share your information outside this app. Granting access is
            required for the app to function properly.
          </p>
          <button onClick={startAuth}>Connect Spotify</button>
        </div>
      </div>
    </>
  );
}

export default LoginPerms;
