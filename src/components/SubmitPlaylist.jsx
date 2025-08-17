import style from "./SubmitPlaylist.module.css";
import icon from "../assets/spotify-icon.svg";

export default function SubmitPlaylist({
  name,
  onNameChange,
  onSubmit,
  error,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.();
  }

  return (
    <form className={style.grid} onSubmit={handleSubmit} noValidate>
      <span aria-hidden="true">
        <img className={style.icon} src={icon} alt="" />
      </span>

      <label htmlFor="pl-name" className={style.srOnly}>
        Playlist name
      </label>
      <input
        id="pl-name"
        className={style.nameInput}
        type="text"
        placeholder="Playlist name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        required
        aria-invalid={!!error}
      />

      {error && (
        <div className={style.error} role="alert" aria-live="polite">
          {error}
        </div>
      )}

      <button type="submit" className={style.submitButton}>
        Submit To Spotify!
      </button>

      <small className={style.helperText}>
        Give it a name and add tracks, then submit to your Spotify library.
      </small>
    </form>
  );
}
