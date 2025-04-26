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

  /* ───── listen for auth changes ───── */
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  /* ───── click-outside to close ───── */
  useEffect(() => {
    const close = (e) =>
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      setMenuOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    navigate("/");
  };

  /* avatar fallback */
  const avatarSrc =
    user?.photoURL ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${
      user?.email ?? "U"
    }&backgroundColor=083344,0f766e&textColor=ffffff`;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold text-white flex-shrink-0">
          Slate
        </Link>

        {/* Right-side controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Display name – hide on very small screens */}
          {!!user && (
            <span className="hidden sm:block text-sm text-gray-300 truncate max-w-[10rem] whitespace-nowrap">
              {user.displayName || user.email}
            </span>
          )}

          {/* Avatar + dropdown wrapper */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0
                         focus:outline-none ring-2 ring-blue-600 ring-offset-2
                         ring-offset-gray-900 transition-transform hover:scale-105"
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
                    <li>
                      <Link
                        to="/membership"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Membership
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
        </div>
      </header>

      {/* Routed pages */}
      <main className="max-w-4xl mx-auto p-8 space-y-16 mt-8">
        <Outlet />
      </main>
    </div>
  );
}

