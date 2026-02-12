import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const data = await login(username, password);

      // store token
      localStorage.setItem("token", data.access_token);

      navigate("/"); // go to dashboard
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass w-[420px] p-8 rounded-2xl space-y-6">
        <h1 className="text-3xl font-semibold text-center">Welcome Back</h1>
        <p className="text-center text-gray-400">
          Sign in to your SEFS account
        </p>

        {error && (
          <div className="text-red-400 text-center text-sm">{error}</div>
        )}

        <input
          className="w-full px-4 py-3 rounded-xl bg-black/40 outline-none"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full px-4 py-3 rounded-xl bg-black/40 outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl bg-emerald-400 text-black font-semibold hover:scale-[1.02] transition"
        >
          Sign In →
        </button>
      </div>
    </div>
  );
}
