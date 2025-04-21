import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 space-y-4 max-w-md mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold text-white text-center">Login</h2>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
      >
        Login
      </button>
    </form>
  );
}

