// src/components/ConfirmModal.jsx
import React, { useEffect } from "react";

export default function ConfirmModal({ open, onClose, data }) {
  if (!open || !data) return null;

  const { name, tracks, playlistUrl } = data;

  // close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="modalOverlay"
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(680px, 92vw)",
          background: "#1b1c21",
          color: "#e8e8e8",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 16,
          padding: "1rem 1.25rem",
          boxShadow: "0 16px 48px rgba(0,0,0,.45)",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
            Playlist created: <strong>{name}</strong>
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,.2)",
              color: "#e8e8e8",
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </header>

        {playlistUrl && (
          <p style={{ margin: ".5rem 0 1rem" }}>
            View on Spotify:{" "}
            <a
              href={playlistUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#1ed760" }}
            >
              {playlistUrl}
            </a>
          </p>
        )}

        <ul
          style={{
            display: "grid",
            gap: 8,
            maxHeight: "45vh",
            overflow: "auto",
            padding: 0,
            margin: 0,
            listStyle: "none",
          }}
        >
          {tracks.map((t) => (
            <li
              key={t.id}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                gap: 12,
                alignItems: "center",
                padding: "8px 10px",
                border: "1px solid rgba(255,255,255,.06)",
                borderRadius: 12,
                background: "#20222a",
              }}
            >
              {t.cover ? (
                <img
                  src={t.cover}
                  alt=""
                  width="48"
                  height="48"
                  style={{ borderRadius: 8, objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: "#2a2d36",
                  }}
                />
              )}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: 600,
                  }}
                >
                  {t.title}
                </div>
                <div
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "#b3b3b3",
                    fontSize: ".92rem",
                  }}
                >
                  {t.artists}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#1ed760",
              color: "#0b0b0b",
              border: "none",
              borderRadius: 999,
              padding: ".7rem 1.1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
