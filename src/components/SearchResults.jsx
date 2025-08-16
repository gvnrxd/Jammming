import styles from "./SearchResults.module.css";

export default function SearchResults({ results, onAdd }) {
  const tracks = results?.tracks ?? [];

  return (
    <section className={styles.section}>
      {tracks.length > 0 && (
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

              {/* + button */}
              <button
                className={styles.addBtn}
                onClick={() => onAdd(t)}
                aria-label={`Add ${t.name} to playlist`}
                title="Add to playlist"
              >
                +
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
