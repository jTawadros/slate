// src/Layout.jsx
import { useEffect, useState, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import "./index.css"

export default function Layout() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <Link to="/" className="text-2xl font-bold text-white">Slate</Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center focus:outline-none"
          >
            {/* Black circle avatar icon */}
          </button>

          <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <ul className="py-1 text-gray-800 text-sm">
              {!user ? (
                <>
                  <li>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Login</Link>
                  </li>
                  <li>
                    <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                  </li>
                  <li>
                    <Link to="/account" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>My Account</Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Settings</Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8 space-y-16 mt-8">
        <Outlet />
      </main>
    </div>
  );
}

