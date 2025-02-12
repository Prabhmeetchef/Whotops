"use client";
import { useState, useEffect } from "react";
import { fetchUserData, UserData } from "@/lib/codeforces";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Users } from "lucide-react";

interface Group {
  name: string;
  member: string[];
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handle = localStorage.getItem("userHandle");
    if (!handle) {
      router.push("/");
      return;
    }
    fetchData(handle);
    fetchGroups(handle);
  }, []);

  const fetchData = async (handle: string) => {
    setLoading(true);
    const data = await fetchUserData(handle);
    setUserData(data);
    setLoading(false);
  };

  const fetchGroups = async (handle: string) => {
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
      });

      const data = await res.json();
      if (data.groups) {
        setGroups(
          data.groups.map((g: { name?: string; member?: string[] }) => ({
            name: g.name || "Unnamed Group",
            member: Array.isArray(g.member) ? g.member : [],
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-6 bg-black">
      <header className="w-full mb-12">
        <Image
          src="/whotops_logo.png"
          alt="Whotops Logo"
          width={120}
          height={60}
        />
      </header>

      <div className="bg-[#0f0f0f] shadow-lg rounded-lg p-6 w-full max-w-2xl mb-10">
        {loading ? (
          <p className="text-gray-400 mt-4">Fetching Profile</p>
        ) : userData ? (
          <div className="text-white">
            <p className="text-2xl font-semibold text-[#e96eff] mb-6 flex gap-2">
              <button onClick={() => router.push('/profile')} className="bg-black p-1 border-gray-800 border-2 rounded-[6px]">
                <User className="text-white" />
              </button>
              {userData.handle}
            </p>
            <div className="flex gap-6">
              <p>Total Solved: {userData.totalSolved}</p>
              <p>Solved This Week: {userData.weeklySolved}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 mt-4">No user data available.</p>
        )}
      </div>

      <div className="bg-[#0f0f0f] shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl text-white font-semibold mb-6">Your Groups</h2>
        {groups.length > 0 ? (
          groups.map((group, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-[#181818] p-4 rounded-lg mb-2 cursor-pointer text-white"
              onClick={() =>
                router.push(
                  `/group?name=${encodeURIComponent(
                    group.name
                  )}&members=${encodeURIComponent(
                    JSON.stringify(group.member)
                  )}`
                )
              }
            >
              <span className="flex gap-[10px] justify-center items-center">
                <Users className="opacity-30" />
                {group.name}
              </span>
              <p className="opacity-30">{group.member.length} members</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">You are not in any groups.</p>
        )}
      </div>
    </main>
  );
}
