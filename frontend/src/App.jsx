// src/App.jsx
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const MAX_FREE_WORDS = 500;          // <── change to any number you like

export default function App() {
  const [user, setUser]         = useState(null);
  const [notes, setNotes]       = useState("");
  const [summary, setSummary]   = useState("");
  const [summaryLength, setSummaryLength] = useState("Medium");
  const [warn, setWarn]         = useState("");

  /* ───── watch auth state ───── */
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  /* ───── helper: word count ───── */
  const countWords = (text) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  /* ───── textarea change handler ───── */
  const handleNotesChange = (e) => {
    const text = e.target.value;
    const words = countWords(text);

    if (!user && words > MAX_FREE_WORDS) {
      setWarn(`Free users are limited to ${MAX_FREE_WORDS} words.`);
      return;                         // ignore extra input
    }
    setWarn("");
    setNotes(text);
  };

  /* ───── form submit ───── */
  const handleGenerate = async (e) => {
    e.preventDefault();

    // double-check before hitting the API
    if (!user && countWords(notes) > MAX_FREE_WORDS) {
      setWarn(`Free users are limited to ${MAX_FREE_WORDS} words.`);
      return;
    }

    setSummary("Generating…");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notes,
            report_type: "General Summary",
            summary_length: summaryLength,
            uid: user?.uid ?? null,   // let backend know who (if anyone) sent it
          }),
        }
      );
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setSummary("Error generating summary.");
    }
  };

  /* ───── UI ───── */
  return (
    <>
      {/* existing hero, buttons, etc. */}

      <form
        onSubmit={handleGenerate}
        className="relative z-10 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 space-y-4"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            className="w-full h-32 p-3 rounded-md bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Paste notes here..."
            required
          />
          {/* word-limit warning */}
          {warn && (
            <p className="mt-1 text-xs text-red-400">
              {warn}
            </p>
          )}
        </div>

        {/* …Generate / New Prompt buttons stay the same… */}
      </form>

      {/* Summary Preview section (unchanged) */}
    </>
  );
}

