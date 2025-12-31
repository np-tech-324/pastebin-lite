"use client";

import { useState } from "react";

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
    } catch (err) {
      setError("Failed to create paste");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Pastebin Lite</h1>
      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={6}
        placeholder="Enter your text..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="number"
        placeholder="TTL in seconds (optional)"
        className="w-full p-2 border rounded mb-2"
        value={ttl}
        onChange={(e) => setTtl(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max views (optional)"
        className="w-full p-2 border rounded mb-2"
        value={maxViews}
        onChange={(e) => setMaxViews(e.target.value)}
      />
      <button
        onClick={createPaste}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Paste
      </button>

      {pasteUrl && (
        <p className="mt-4">
          ✅ Paste created:{" "}
          <a href={pasteUrl} target="_blank" className="text-blue-600 underline">
            {pasteUrl}
          </a>
        </p>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
