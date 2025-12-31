"use client";

import { useState } from "react";
import "./page.css";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const [error, setError] = useState("");

  const createPaste = async () => {
    setError("");
    setPasteUrl("");

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? parseInt(ttl) : undefined,
          max_views: maxViews ? parseInt(maxViews) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setPasteUrl(data.url);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch {
      setError("Failed to create paste");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Pastebin Lite</h1>

        <textarea
          className="textarea"
          rows={6}
          placeholder="Enter your text..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          type="number"
          placeholder="TTL in seconds (optional)"
          className="input"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max views (optional)"
          className="input"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
        />

        <button className="button" onClick={createPaste}>
          Create Paste
        </button>

        {pasteUrl && (
          <div className="success">
            ✅ Paste created:
            <a href={pasteUrl} target="_blank">
              {pasteUrl}
            </a>
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
