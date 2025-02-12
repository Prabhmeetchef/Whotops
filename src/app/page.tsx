"use client";
import Image from "next/image";
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
    localStorage.setItem("userPassword", data.password);
    // ✅ Redirect to dashboard
    router.push("/dashboard");
  };
  return (
    <div className="bg-black">
    <div className="flex flex-col items-center pt-20 h-[100vh] bg-cover bg-center" style={{ backgroundImage: "url('/layered-peaks-haikei (1).svg')"}}>
      <div className="bg-[#0f0f0f] shadow-lg rounded-lg p-12">
        <Image src="/whotops_logo.png" alt="logo" width={200} height={60}></Image>
        <h1 className="text-white text-4xl font-normal pt-12 mb-2">Sign in with Codeforces</h1>
        <h2 className="text-gray-200 opacity-75 text-[16px]">Please know that we are an invite only platform.
          <br/> Enter your special credentials to continue.
        </h2>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <input
          type="text"
          placeholder="Codeforces Handle"
          className="w-full p-2 mt-8 bg-gray-800 text-white rounded"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mt-4 bg-gray-800 text-white rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full mt-10 p-2 bg-gradient-to-b from-[#E23CFF] to-[#9900b4] text-white font-semibold rounded hover:"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
    </div>
  );
}
