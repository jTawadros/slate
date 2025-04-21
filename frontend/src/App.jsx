import { useState } from "react";
import "./index.css";

export default function App() {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Slate</h1>
        <button
          className="text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </header>

      {/* Mobile nav */}
      <div
        className={`overflow-hidden bg-gray-800 border-b border-gray-700 transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-40 py-4 px-6" : "max-h-0"
        }`}
      >
        <nav className="space-y-2">
          <a href="#" className="block text-sm hover:text-white">
            Dashboard
          </a>
          <a href="#" className="block text-sm hover:text-white">
            Settings
          </a>
          <a href="#" className="block text-sm hover:text-white">
            Logout
          </a>
        </nav>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto p-6 space-y-10">
        {/* Description */}
        <section className="text-center">
          <h2 className="text-4xl font-extrabold text-white">
            Generate Clean Reports
          </h2>
          <p className="mt-2 text-gray-400 text-sm">
            Paste in your messy notes — we’ll handle the formatting.
          </p>
        </section>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSummary(`Generated summary from: ${notes}`);
          }}
          className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 space-y-4"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
          >
            Generate Report
          </button>
        </form>

        {/* Preview */}
        {summary && (
          <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">
              Generated Report
            </h3>
            <p className="text-sm text-gray-200 whitespace-pre-wrap">
              {summary}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
