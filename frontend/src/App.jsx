import { useState } from "react";

export default function App() {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");

  const handleClear = () => {
    setNotes("");
    setSummary("");
  };

  return (
    <>
      {/* Animated Background Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse z-0" />

      {/* Hero Section */}
      <section className="text-center space-y-4 relative z-10 pt-16 pb-10 animate-fade-in-up">
        <h2 className="text-5xl font-extrabold text-white transition-all duration-500 hover:scale-105">
          Summarize Anything in Seconds
        </h2>
        <p className="mt-2 text-gray-400 text-base max-w-2xl mx-auto">
          SlateWorks uses AI to turn messy notes, emails, and case logs into clear, professional summaries.
          Perfect for students, healthcare workers, and busy professionals who need fast, structured reports.
        </p>
      </section>

      {/* Form Section */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSummary("Generating...");

          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notes, report_type: "General Summary" }),
            });

            const data = await res.json();
            setSummary(data.summary);
          } catch (err) {
            console.error(err);
            setSummary("Error generating summary.");
          }
        }}
        className="relative z-10 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 space-y-4"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 p-3 rounded-md bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Paste notes here..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition transform hover:scale-105"
        >
          Generate Summary Report
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md font-medium transition transform hover:scale-105 mt-2"
        >
          New Prompt
        </button>
      </form>

      {/* Summary Preview */}
      {summary && (
        <section className="relative z-10 bg-gray-800 p-6 rounded-lg border border-gray-700 mt-6">
          <h3 className="text-xl font-bold text-white mb-2">Generated Report</h3>
          <p className="text-sm text-gray-200 whitespace-pre-wrap">{summary}</p>
        </section>
      )}
    </>
  );
}

