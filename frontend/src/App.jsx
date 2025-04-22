import { useState } from "react";

export default function App() {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");

  const handleClear = () => {
    setNotes("");
    setSummary("");
  };

  return (
    <div className="min-h-screen px-4 py-10 text-gray-100 bg-gray-900 font-sans">
      {/* Hero Section */}
      <section className="text-center mb-10 space-y-3">
        <h2 className="text-4xl font-extrabold text-white animate-fade-in">
          Summarize Anything in Seconds
        </h2>
        <p className="mt-2 text-gray-400 text-base max-w-2xl mx-auto animate-fade-in-slow">
          SlateWorks uses AI to turn messy notes, emails, and case logs into clear, professional summaries.
          Perfect for students, healthcare workers, and busy professionals who need fast, structured reports.
        </p>
      </section>

      {/* Form */}
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
        className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 space-y-5 max-w-2xl mx-auto animate-fade-in"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-40 p-4 rounded-lg bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Paste notes here..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition transform hover:scale-[1.01]"
        >
          Generate Summary Report
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition transform hover:scale-[1.01]"
        >
          New Prompt
        </button>
      </form>

      {/* Summary Output */}
      {summary && (
        <section className="bg-gray-800 p-6 mt-8 rounded-xl border border-gray-700 max-w-2xl mx-auto animate-fade-in-slow">
          <h3 className="text-xl font-bold text-white mb-3">Generated Report</h3>
          <p className="text-sm text-gray-200 whitespace-pre-wrap">{summary}</p>
        </section>
      )}
    </div>
  );
}

