import style from "./SubmitPlaylist.module.css";
import icon from "../assets/spotify-icon.svg";
const SubmitPlaylist = () => {
  return (
    <>
      <form className={style.grid}>
        <span>
          <img className={style.icon} src={icon} />
        </span>
        <button type="submit" className={style.submitButton}>
          Submit To Spotify!
        </button>
        <small className={style.helperText}>
          Click to send your custom playlist straight into your Spotify
          library."
        </small>
      </form>
    </>
  );
};
export default SubmitPlaylist;
