"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }

    // ✅ Store handle in localStorage
    localStorage.setItem("userHandle", data.handle);

    // ✅ Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-black">
      <div className="bg-[#0f0f0f] shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-white text-2xl font-bold">Login</h1>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <input
          type="text"
          placeholder="Codeforces Handle"
          className="w-full p-2 mt-4 bg-gray-800 text-white rounded"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mt-2 bg-gray-800 text-white rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full mt-4 p-2 bg-purple-600 text-white rounded"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </main>
  );
}
