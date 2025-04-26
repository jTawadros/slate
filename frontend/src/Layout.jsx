// src/Layout.jsx
import { useEffect, useState, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import "./index.css";

export default function Layout() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  /* ───────── Auth listener ───────── */
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  /* ─────── Click-outside close ───── */
  useEffect(() => {
    const handleClickOutside = (e) =>
      dropdownRef.current && !dropdownRef.current.contains(e.target) && setMenuOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    navigate("/");
  };

  /* ────────── Avatar logic ───────── */
  const avatarSrc =
    user?.photoURL ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email ?? "U"}&backgroundColor=083344,0f766e&textColor=ffffff`;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <Link to="/" className="text-2xl font-bold text-white">
          Slate
        </Link>

        {/* Avatar + name wrapper */}
        <div className="relative flex items-center gap-2" ref={dropdownRef}>
          {/* Display name (hidden on xs) */}
          {!!user && (
            <span className="hidden sm:block text-sm text-gray-300 truncate max-w-[10rem]">
              {user.displayName || user.email}
            </span>
          )}

          {/* Avatar button */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full overflow-hidden focus:outline-none ring-2 ring-blue-600 ring-offset-2 ring-offset-gray-900 transition-transform hover:scale-105"
          >
            <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
          </button>

          {/* Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 transition-opacity duration-200 ${
              menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ul className="py-1 text-gray-800 text-sm">
              {!user ? (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/account"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Routed pages */}
      <main className="max-w-4xl mx-auto p-8 space-y-16 mt-8">
        <Outlet />
      </main>
    </div>
  );
}

