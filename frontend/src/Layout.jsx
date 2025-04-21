import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "./index.css";

export default function Layout() {
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
          <Link to="/login" className="block text-sm hover:text-white">Login</Link>
          <Link to="/signup" className="block text-sm hover:text-white">Sign Up</Link>
          <Link to="/" className="block text-sm hover:text-white">Home</Link>
        </nav>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto p-6 space-y-10">
        <Outlet />
      </main>
    </div>
  );
}

