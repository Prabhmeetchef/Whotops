"use client";
import Link from "next/link";
import Image from "next/image";

export default function Profile() {
  const handle = localStorage.getItem("userHandle");
  const password = localStorage.getItem("userPassword");














  
  return (
    <main className="flex flex-col items-center min-h-screen p-6 bg-black">
      <header className="w-full mb-12">
        <Link href={'/dashboard'}><Image
          src="/whotops_logo.png"
          alt="Whotops Logo"
          width={120}
          height={60}
        /></Link>
      </header>
      <p className="text-white mt-10">
        <span className="text-[#8b8b8b]">Name:</span> {handle}{" "}
        {(handle === "prabhmeetcook" || handle === "Harsha379") && "🐐"}
      </p>
      <p className="text-white mt-2">
        <span className="text-[#8b8b8b]">Password:</span> {password}
      </p>
    </main>
  );
}
