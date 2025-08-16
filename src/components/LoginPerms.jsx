import styles from "./LoginPerms.module.css";
import icon from "../assets/spotify-icon.svg";
function LoginPerms({ startAuth }) {
  return (
    <>
      <div className={styles.permsBox}>
        <div className={styles.contentBox}>
          <h1 className={styles.permsHeader}>
            <span>
              <img className={styles.spotifyLogo} src={icon} />
            </span>
            Connect Spotify
          </h1>
          <p className={styles.subText}>
            Jamming needs limited permission to work.
          </p>
          <h2 className={styles.subHeader}>
            We'll use your Spotify account to build and save playlists.
          </h2>
          <ul>
            <li>Show your display name so you know you're signed in</li>
            <li>Search Spotify's music library</li>
            <li>Create and save playlists to your account</li>
          </ul>
          <p>
            We won't change your account settings, access your private listening
            history, or share your info outside this app.
          </p>
          <button onClick={startAuth}>Continue with Spotify</button>
          <details class="disclosure" close>
            <summary>What permissions are requested?</summary>

            <div class="disclosure-panel">
              <h4>Required</h4>
              <ul>
                <li>
                  <strong>View your basic profile</strong>
                  <code>(user-read-private)</code>
                  <br />
                  Lets us read your display name, user ID, and account country
                  so we can show “Signed in as …” and save playlists to the
                  right account.
                </li>
                <li>
                  <strong>Create and edit playlists you own</strong>
                  <code>(playlist-modify-public, playlist-modify-private)</code>
                  <br />
                  Allows the app to create new playlists, add/remove tracks, and
                  update titles/descriptions—so your search results can be saved
                  as a playlist (public or private).
                </li>
              </ul>

              <h4>Optional (only if you enable the feature)</h4>
              <ul>
                <li>
                  <strong>See your private playlists</strong>
                  <code>(playlist-read-private)</code>
                  <br />
                  Used if you choose to add tracks into an existing{" "}
                  <em>private</em> playlist from inside the app.
                </li>
                <li>
                  <strong>See your collaborative playlists</strong>
                  <code>(playlist-read-collaborative)</code>
                  <br />
                  Needed only if you want to add tracks to a collaborative
                  playlist you’re part of.
                </li>
                <li>
                  <strong>Upload a custom playlist cover</strong>
                  <code>(ugc-image-upload)</code>
                  <br />
                  Enables setting a cover image for playlists created by this
                  app (if you use that feature).
                </li>
                <li>
                  <strong>Read your email address</strong>
                  <code>(user-read-email)</code>
                  <br />
                  Sometimes used for account support or contact; not required
                  for saving playlists.
                </li>
              </ul>

              <h4>
                What we <em>don’t</em> request
              </h4>
              <ul>
                <li>
                  No streaming control or remote control (<code>streaming</code>
                  , <code>app-remote-control</code>)
                </li>
                <li>
                  No listening history or personal insights (
                  <code>user-read-recently-played</code>,{" "}
                  <code>user-top-read</code>)
                </li>
                <li>
                  No library changes (<code>user-library-modify</code>) and no
                  following/unfollowing artists or users
                </li>
                <li>
                  No access to your private listening activity beyond the scopes
                  listed above
                </li>
              </ul>

              <p class="disclosure-note">
                We use only the minimum access needed to let you search tracks
                and save them into playlists under your account. You can revoke
                access anytime from your Spotify account settings.
              </p>
            </div>
          </details>
        </div>
      </div>
    </>
  );
}

export default LoginPerms;
