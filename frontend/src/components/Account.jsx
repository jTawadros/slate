import React, { useState } from "react";
import { auth, storage } from "../firebase";
import { updateProfile, updatePassword } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function Account() {
  const [uploading, setUploading] = useState(false);

  if (!auth.currentUser) {
    return <div>Not logged in... How'd you get here?</div>;
  }

  const handleChangeDisplayName = async () => {
    const newName = window.prompt("Enter your new display name:");
    if (!newName) return;

    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      toast.success("Display name updated!");
    } catch (error) {
      toast.error("Failed to update name.");
      console.error(error);
    }
  };

  const handleUploadProfilePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log("Selected file:", file);
    // 🚨 For now, just log it. Uploading can be added later.
    toast.success("File selected!");
  };

  const handleUpdatePassword = async () => {
    const newPassword = window.prompt("Enter your new password:");
    if (!newPassword) return;

    try {
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Password updated!");
    } catch (error) {
      toast.error("Failed to update password.");
      console.error(error);
    }
  };

  return (
    <form className="max-w-md mx-auto p-6 space-y-6 bg-gray-800 rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-white text-center">Account Page</h1>

      <div className="text-center text-gray-300">
        <p><strong>Email:</strong> {auth.currentUser.email}</p>
        {auth.currentUser.displayName && (
          <p><strong>Name:</strong> {auth.currentUser.displayName}</p>
        )}
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleChangeDisplayName}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Change Display Name
        </button>

        <label className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center cursor-pointer transition">
          Upload Profile Picture
          <input
            type="file"
            onChange={handleUploadProfilePicture}
            className="hidden"
            accept="image/*"
          />
        </label>

        <button
          type="button"
          onClick={handleUpdatePassword}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Update Password
        </button>
      </div>
    </form>
  );
}

