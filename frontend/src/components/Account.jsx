import React, { useState } from "react";
import { auth } from "../firebase";

export default function Account() {
  const [activeTab, setActiveTab] = useState("accountInfo");

  if (!auth.currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1>Not logged in... How'd you get here?</h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/5 min-w-[220px] bg-gray-800 p-6 space-y-4 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        <button
          onClick={() => setActiveTab("accountInfo")}
          className={`block w-full text-left px-4 py-2 rounded-md ${
            activeTab === "accountInfo"
              ? "bg-blue-600"
              : "hover:bg-gray-700"
          }`}
        >
          Account Info
        </button>
        <button
          onClick={() => setActiveTab("accountSettings")}
          className={`block w-full text-left px-4 py-2 rounded-md ${
            activeTab === "accountSettings"
              ? "bg-blue-600"
              : "hover:bg-gray-700"
          }`}
        >
          Account Settings
        </button>
        <button
          onClick={() => setActiveTab("privacySettings")}
          className={`block w-full text-left px-4 py-2 rounded-md ${
            activeTab === "privacySettings"
              ? "bg-blue-600"
              : "hover:bg-gray-700"
          }`}
        >
          Privacy Settings
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`block w-full text-left px-4 py-2 rounded-md ${
            activeTab === "billing"
              ? "bg-blue-600"
              : "hover:bg-gray-700"
          }`}
        >
          Billing
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {activeTab === "accountInfo" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Account Information</h1>
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold">Display Name:</h2>
                <p className="text-gray-400">(Coming soon)</p>
              </div>
              <div>
                <h2 className="font-semibold">Profile Photo:</h2>
                <p className="text-gray-400">(Coming soon)</p>
              </div>
              <div>
                <h2 className="font-semibold">Email:</h2>
                <p>{auth.currentUser.email}</p>
              </div>
              <div>
                <h2 className="font-semibold">Password:</h2>
                <p>********</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "accountSettings" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
            <p className="text-gray-400">Enable 2FA (Coming Soon)</p>
          </div>
        )}

        {activeTab === "privacySettings" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Privacy Settings</h1>
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold">Change Password</h2>
                <p className="text-gray-400">(Coming soon - requires reauth)</p>
              </div>
              <div>
                <h2 className="font-semibold">Update Email</h2>
                <p className="text-gray-400">(Coming soon - requires reauth)</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Billing</h1>
            <p className="text-gray-400">Stripe integration coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

