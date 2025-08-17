import styles from "./Playlist.module.css";

export default function Playlist({ tracks, onRemove }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>New Playlist</h2>

      {tracks.length === 0 ? (
        <p className={styles.muted}>Add songs with the + button.</p>
      ) : (
        <div className={styles.grid}>
          {tracks.map((t) => (
            <article className={styles.card} key={t.id}>
              {t.album?.images?.[2]?.url && (
                <img
                  className={styles.cover}
                  src={t.album.images[2].url}
                  alt=""
                />
              )}

              <div className={styles.meta}>
                <div className={styles.title}>{t.name}</div>
                <div className={styles.sub}>
                  {t.artists.map((a) => a.name).join(", ")}
                </div>
              </div>

              <button
                className={styles.removeBtn}
                onClick={() => onRemove(t.id)}
                aria-label={`Remove ${t.name}`}
                title="Remove"
              >
                ×
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
