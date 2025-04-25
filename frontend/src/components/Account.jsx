import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { Link } from "react-router-dom";

export default function Account() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Account Info");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
      setDisplayName(auth.currentUser.displayName || "");
      setEmail(auth.currentUser.email || "");
      setPhotoURL(auth.currentUser.photoURL || "");
    }
  }, []);

  if (!user) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Not logged in... How'd you get here?
      </div>
    );
  }

  const handleReauth = async () => {
    const cred = EmailAuthProvider.credential(user.email, currentPassword);
    try {
      await reauthenticateWithCredential(user, cred);
      return true;
    } catch (err) {
      setError("Reauthentication failed. Please check your password.");
      return false;
    }
  };

  const handleUpdateDisplayName = async () => {
    try {
      await updateProfile(user, { displayName });
      setError("Display name updated!");
    } catch (err) {
      setError("Error updating display name.");
    }
  };

  const handleUpdatePhoto = async () => {
    try {
      await updateProfile(user, { photoURL });
      setError("Profile photo updated!");
    } catch (err) {
      setError("Error updating profile photo.");
    }
  };

  const handleUpdateEmail = async () => {
    const ok = await handleReauth();
    if (ok) {
      try {
        await updateEmail(user, email);
        setError("Email updated!");
      } catch (err) {
        setError("Error updating email.");
      }
    }
  };

  const handleUpdatePassword = async () => {
    const ok = await handleReauth();
    if (ok) {
      try {
        await updatePassword(user, newPassword);
        setError("Password updated!");
      } catch (err) {
        setError("Error updating password.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-4">
        <h2 className="text-lg font-bold mb-6">Settings</h2>
        {["Account Info", "Account Settings", "Privacy Settings", "Billing"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`block w-full text-left px-4 py-2 rounded-md transition ${
              activeTab === tab ? "bg-blue-600 text-white" : "hover:bg-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
        <Link to="/" className="block mt-10 text-sm text-gray-400 hover:text-white">← Back to Home</Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-6">
        {error && <div className="bg-red-500 p-3 rounded-md">{error}</div>}

        {activeTab === "Account Info" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Account Info</h1>

            <div className="flex items-center space-x-4">
              <img
                src={photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
              />
              <div>
                <input
                  type="text"
                  placeholder="Profile Picture URL"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="bg-gray-800 border border-gray-600 p-2 rounded-md text-white w-64"
                />
                <button
                  onClick={handleUpdatePhoto}
                  className="ml-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                >
                  Update Photo
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Display Name</p>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-gray-800 border border-gray-600 p-2 rounded-md w-64"
              />
              <button
                onClick={handleUpdateDisplayName}
                className="ml-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
              >
                Save Name
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border border-gray-600 p-2 rounded-md w-64"
              />
            </div>

            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Password (hidden)</p>
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-800 border border-gray-600 p-2 rounded-md w-64"
              />
            </div>
          </div>
        )}

        {activeTab === "Account Settings" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <p className="text-gray-400">Coming soon: Dark mode, 2FA, notification preferences...</p>
          </div>
        )}

        {activeTab === "Privacy Settings" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Privacy Settings</h1>
            <div className="space-y-4">
              <p className="text-sm text-gray-400">🔒 Re-enter password below to proceed with email or password changes.</p>
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-gray-800 border border-gray-600 p-2 rounded-md w-64"
              />

              <div className="flex space-x-4">
                <button
                  onClick={handleUpdateEmail}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                >
                  Update Email
                </button>
                <button
                  onClick={handleUpdatePassword}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Billing" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Billing</h1>
            <p className="text-gray-400">Payment plans, subscriptions, and Stripe integration coming soon!</p>
          </div>
        )}
      </main>
    </div>
  );
}

