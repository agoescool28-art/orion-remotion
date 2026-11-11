
import React, { useState } from "react";

export const ChatStudio: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [script, setScript] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [status, setStatus] = useState("Menunggu materi");

  const handleSubmit = () => {
    if (!prompt.trim() || !script || !audio) {
      setStatus("Lengkapi instruksi, naskah, dan audio.");
      return;
    }

    setStatus(
      "Materi siap. Backend rendering belum dihubungkan."
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#101114",
      color: "#f5f5f5",
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <main style={{
        maxWidth: 760,
        margin: "0 auto"
      }}>
        <h1 style={{ fontSize: 32 }}>
          ORION <span style={{ color: "#65a8ff" }}>STUDIO</span>
        </h1>

        <p style={{ color: "#aaa" }}>
          Chat-to-Video Production Engine
        </p>

        <div style={{
          background: "#1b1d22",
          border: "1px solid #343740",
          borderRadius: 16,
          padding: 24,
          marginTop: 30
        }}>
          <h2>Instruksi produksi video</h2>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Contoh: Buat video edukasi evolusi teknologi otomotif. Gaya cinematic industrial, format 9:16."
            rows={5}
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "#101114",
              color: "white",
              border: "1px solid #454955",
              borderRadius: 10,
              padding: 14,
              fontSize: 15,
              resize: "vertical"
            }}
          />

          <h3>Naskah video (.txt)</h3>
          <input
            type="file"
            accept=".txt,text/plain"
            onChange={(e) =>
              setScript(e.target.files?.[0] || null)
            }
          />
          <p style={{ color: "#aaa" }}>
            {script?.name || "Belum ada naskah"}
          </p>

          <h3>Audio narasi (.mp3 / .wav)</h3>
          <input
            type="file"
            accept="audio/mpeg,audio/wav,.mp3,.wav"
            onChange={(e) =>
              setAudio(e.target.files?.[0] || null)
            }
          />
          <p style={{ color: "#aaa" }}>
            {audio?.name || "Belum ada audio"}
          </p>

          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: 16,
              marginTop: 24,
              border: 0,
              borderRadius: 10,
              background: "#3478f6",
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer"
            }}
          >
            PROSES & RENDER VIDEO
          </button>

          <p style={{
            marginTop: 20,
            color: "#9bbcff"
          }}>
            Status: {status}
          </p>
        </div>
      </main>
    </div>
  );
};
