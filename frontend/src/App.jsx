import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const MAX_FREE_WORDS = 150;

export default function App() {
  const [user, setUser]           = useState(null);
  const [notes, setNotes]         = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [summary, setSummary]     = useState("");
  const [summaryLength, setSummaryLength] = useState("Medium");
  const [warn, setWarn]           = useState("");

  /* auth listener */
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const countWords = (text) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  const handleNotesChange = (e) => {
    const text  = e.target.value;
    const words = countWords(text);

    if (!user && words > MAX_FREE_WORDS) {
      setWarn(`Free users are limited to ${MAX_FREE_WORDS} words.`);
      return;
    }
    setWarn("");
    setWordCount(words);
    setNotes(text);
  };

  const handleClear = () => {
    setNotes("");
    setSummary("");
    setWordCount(0);
    setWarn("");
  };

  const generateSummary = async (e) => {
    e.preventDefault();
    if (!user && wordCount > MAX_FREE_WORDS) {
      setWarn(`Free users are limited to ${MAX_FREE_WORDS} words.`);
      return;
    }

    setSummary("Generating...");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes,
          report_type: "General Summary",
          summary_length: summaryLength,
          uid: user?.uid ?? null,
        }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setSummary("Error generating summary.");
    }
  };

  return (
    <>
      {/* Animated Background Blob */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse z-0" />

      {/* Hero Section */}
      <section className="text-center space-y-4 relative z-10 pt-16 pb-10 animate-fade-in-up">
        <h2 className="text-5xl font-extrabold text-white transition-all duration-500 hover:scale-105">
          Summarize Anything in Seconds
        </h2>
        <p className="mt-2 text-gray-400 text-base max-w-2xl mx-auto">
          SlateWorks uses AI to turn messy notes, emails, and case logs into
          clear, professional summaries. Perfect for students, healthcare
          workers, and busy professionals who need fast, structured reports.
        </p>
      </section>

      {/* Set Verbosity Length */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-400 mb-2">Select summary length:</p>
        <div className="flex justify-center space-x-4">
          {["Short", "Medium", "Long"].map((level) => (
            <button
              key={level}
              onClick={() => setSummaryLength(level)}
              type="button"
              className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                summaryLength === level
                  ? "bg-blue-600 text-white border-blue-400 shadow-lg animate-pulse"
                  : "bg-gray-800 text-gray-300 border-gray-600 hover:border-blue-500 hover:text-white"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={generateSummary}
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
          {/* live word counter */}
          <div className="flex justify-between mt-1 text-xs">
            {warn ? (
              <span className="text-red-400">{warn}</span>
            ) : (
              <span className="text-gray-400">
                {user
                  ? `${wordCount}/♾️ words`
                  : `${wordCount}/${MAX_FREE_WORDS} words`}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <button
            type="submit"
            className="relative w-full sm:w-auto px-6 py-2 rounded-full bg-blue-600 text-white font-medium
                       transition-transform duration-200 transform hover:scale-105
                       before:absolute before:inset-0 before:rounded-full before:border-2 before:border-blue-400
                       before:opacity-0 before:transition-all before:duration-500 hover:before:opacity-100
                       hover:before:animate-trace overflow-hidden z-10"
          >
            Generate Summary
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="relative w-full sm:w-auto px-6 py-2 rounded-full bg-gray-700 text-white font-medium
                       transition-transform duration-200 transform hover:scale-105
                       before:content-[''] before:absolute before:inset-0 before:rounded-full before:border-2 before:border-gray-400
                       before:opacity-0 before:transition-all before:duration-500 hover:before:opacity-100
                       hover:before:animate-trace overflow-hidden z-10"
          >
            New Prompt
          </button>
        </div>
      </form>

      {/* Summary Preview */}
      {summary && (
        <section className="relative z-10 bg-gray-800 p-6 rounded-lg border border-gray-700 mt-6">
          <h3 className="text-xl font-bold text-white mb-2">Generated Report</h3>
          <p className="text-sm text-gray-200 whitespace-pre-wrap">
            {summary}
          </p>
        </section>
      )}
    </>
  );
}

