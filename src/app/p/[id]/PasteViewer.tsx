"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./pasteViewer.css";

interface PasteData {
  content: string;
  views: number;
  maxViews?: number;
  expiresAt?: number;
}

export default function PasteViewer({ id }: { id: string }) {
  const [paste, setPaste] = useState<PasteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("Invalid paste ID");
      setLoading(false);
      return;
    }

    const fetchPaste = async () => {
      try {
        const res = await fetch(`/api/pastes/${id}`, { cache: "no-store" });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to load paste");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setPaste(data);
        setLoading(false);

        if (data.expiresAt) {
          const updateTimer = () => {
            const remaining = Math.max(
              0,
              Math.floor((data.expiresAt - Date.now()) / 1000)
            );
            setTimeRemaining(remaining);

            if (remaining === 0) {
              setError("This paste has expired");
              setPaste(null);
            }
          };

          updateTimer();
          const interval = setInterval(updateTimer, 1000);
          return () => clearInterval(interval);
        }
      } catch {
        setError("Failed to load paste");
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  if (loading) {
    return (
      <div className="pv-page">
        <div className="pv-card">
          <p className="pv-muted">Loading paste…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pv-page">
        <div className="pv-card">
          <h1 className="pv-title pv-error">Error</h1>
          <p className="pv-text">{error}</p>
          <button className="pv-btn" onClick={() => router.push("/")}>
            Create New Paste
          </button>
        </div>
      </div>
    );
  }

  if (!paste) return null;

  const viewsRemaining = paste.maxViews
    ? paste.maxViews - paste.views
    : null;

  return (
    <div className="pv-page">
      <div className="pv-card">
        <h1 className="pv-title">Your Paste</h1>

        <pre className="pv-content">{paste.content}</pre>

        <div className="pv-info">
          <p>
            Views: {paste.views}
            {paste.maxViews ? ` / ${paste.maxViews}` : ""}
          </p>

          {viewsRemaining !== null && viewsRemaining > 0 && (
            <p className="pv-warning">
              ⚠️ {viewsRemaining} view
              {viewsRemaining !== 1 ? "s" : ""} remaining
            </p>
          )}

          {timeRemaining !== null && (
            <p className="pv-muted">
              {timeRemaining > 0
                ? `Expires in: ${Math.floor(timeRemaining / 60)}m ${
                    timeRemaining % 60
                  }s`
                : "Expired"}
            </p>
          )}
        </div>

        <button className="pv-btn" onClick={() => router.push("/")}>
          Create New Paste
        </button>
      </div>
    </div>
  );
}
