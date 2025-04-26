import { useState, useEffect, useRef } from "react";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";

export default function Account() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Account Info");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const sidebarRef = useRef(null);

  /* ─────────────────────────── Fetch user ─────────────────────────── */
  useEffect(() => {
    if (auth.currentUser) {
      const u = auth.currentUser;
      setUser(u);
      setDisplayName(u.displayName || "");
      setEmail(u.email || "");
      setPhotoURL(u.photoURL || "");
    }
  }, []);

  /* ───────────────────────────── Utils ─────────────────────────────── */
  const flash = (msg, type = "success", timeout = 3500) => {
    setAlert({ type, msg });
    if (timeout) setTimeout(() => setAlert({ type: "", msg: "" }), timeout);
  };

  const reauth = async () => {
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      return true;
    } catch {
      flash("Re‑authentication failed. Check your password.", "error");
      return false;
    }
  };

  /* ─────────────────────────── Update handlers ─────────────────────── */
  const handleUpdateDisplayName = async () => {
    try {
      await updateProfile(user, { displayName });
      flash("Display name updated ✔");
    } catch {
      flash("Error updating display name", "error");
    }
  };

  const handleUpdatePhoto = async () => {
    try {
      await updateProfile(user, { photoURL });
      flash("Profile photo updated ✔");
    } catch {
      flash("Error updating profile photo", "error");
    }
  };

  const handleUpdateEmail = async () => {
    if (!(await reauth())) return;
    try {
      await updateEmail(user, email);
      flash("Email updated ✔");
    } catch {
      flash("Error updating email", "error");
    }
  };

  const handleUpdatePassword = async () => {
    if (!(await reauth())) return;
    try {
      await updatePassword(user, newPassword);
      flash("Password updated ✔");
      setNewPassword("");
      setCurrentPassword("");
    } catch {
      flash("Error updating password", "error");
    }
  };
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profilePictures/${user.uid}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: downloadURL });
      setPhotoURL(downloadURL);
      flash("Profile photo updated ✔");
    } catch {
      flash("Error uploading photo", "error");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-400 text-lg">
        Not logged in… how did you get here?
      </div>
    );
  }

  /* ───────────────────────────── Layout ─────────────────────────────── */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-hidden">
      {/* ─── Sidebar */}
      <aside
        ref={sidebarRef}
        className="w-72 shrink-0 border-r border-gray-800/60 bg-gray-900/50 backdrop-blur-md text-gray-200 pt-8 pb-12 px-6 flex flex-col"
      >
        <Link
          to="/"
          className="mb-10 text-2xl font-extrabold tracking-tight text-white"
        >
          Slate<span className="text-blue-500">Works</span>
        </Link>

        {[
          "Account Info",
          "Account Settings",
          "Privacy Settings",
          "Billing",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mb-2 w-full text-left rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-gray-800/60 ${
              activeTab === tab ? "bg-blue-600 text-white" : "text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}

        <div className="mt-auto pt-10 text-xs text-gray-500">
          <Link to="/" className="hover:text-gray-300">
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* ─── Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto py-12 px-6 sm:px-10">
          {/* Toast */}
          {alert.msg && (
            <div
              className={`mb-6 rounded-md px-4 py-3 text-sm font-medium ${
                alert.type === "error"
                  ? "bg-red-600/20 text-red-300 border border-red-700/40"
                  : "bg-emerald-600/20 text-emerald-300 border border-emerald-700/40"
              }`}
            >
              {alert.msg}
            </div>
          )}

          {/* ─── Account Info */}
          {activeTab === "Account Info" && (
            <section className="space-y-8">
              <h1 className="text-3xl font-semibold text-white mb-4">
                Account Information
              </h1>

              {/* Avatar */}
              <div className="flex gap-6 flex-col sm:flex-row items-start sm:items-center">
                <img
                  src={
                    photoURL ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`
                  }
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover border-4 border-blue-500/60 shadow-lg"
                />
                <div className="flex flex-col gap-3">
                  <label className="block text-sm text-gray-400">
                    Upload New Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 hover:file:bg-blue-700"
                  />
                </div>
              </div>

              {/* Display name */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Display Name
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 rounded-lg bg-gray-800/60 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 border border-gray-700/50"
                  />
                  <button
                    onClick={handleUpdateDisplayName}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-gray-800/60 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 border border-gray-700/50"
                />
              </div>
            </section>
          )}

          {/* ─── Account Settings */}
          {activeTab === "Account Settings" && (
            <section>
              <h1 className="text-3xl font-semibold text-white mb-4">
                Account Settings
              </h1>
              <p className="text-gray-400">
                Dark mode, 2‑factor auth, and notifications coming soon…
              </p>
            </section>
          )}

          {/* ─── Privacy Settings */}
          {activeTab === "Privacy Settings" && (
            <section className="space-y-6">
              <h1 className="text-3xl font-semibold text-white mb-4">
                Privacy Settings
              </h1>

              <p className="text-sm text-amber-300 mb-4">
                🔒 Enter your current password, set a new one, then click{" "}
                <em>Update Password</em>.
              </p>

              <div className="grid gap-5 max-w-xs">
                {/* Current password */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg bg-gray-800/60 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 border border-gray-700/50"
                  />
                </div>

                {/* New password */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg bg-gray-800/60 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 border border-gray-700/50"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <button
                  onClick={handleUpdateEmail}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-sm font-medium"
                >
                  Update Email
                </button>
                <button
                  onClick={handleUpdatePassword}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-sm font-medium"
                >
                  Update Password
                </button>
              </div>
            </section>
          )}

          {/* ─── Billing */}
          {activeTab === "Billing" && (
            <section>
              <h1 className="text-3xl font-semibold text-white mb-4">
                Billing
              </h1>
              <p className="text-gray-400">Stripe integration coming soon.</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
