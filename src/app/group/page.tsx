"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import { fetchUserData, UserData } from "@/lib/codeforces";
import Image from "next/image";
import Link from "next/link";

function GroupPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const groupName = searchParams.get("name") || "Unknown Group";

  // Memoize members to prevent re-parsing
  const members = useMemo(() => {
    try {
      return JSON.parse(searchParams.get("members") || "[]");
    } catch {
      return [];
    }
  }, [searchParams]);

  const [membersData, setMembersData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      try {
        const fetchedMembers = await Promise.all(
          members.map(async (handle: string) => fetchUserData(handle))
        );

        const sortedData = fetchedMembers
          .filter((user) => !user.error)
          .sort((a, b) => b.weeklySolved - a.weeklySolved);

        setMembersData(sortedData);
      } catch (error) {
        console.error("Error fetching group members:", error);
      }
      setLoading(false);
    };

    if (members.length > 0) fetchGroupData();
  }, [members]);
  return (
    <main className="flex flex-col items-center min-h-screen p-6 bg-black">
      <header className="w-full mb-12 ">
      <Link href={'/dashboard'}><Image
          src="/whotops_logo.png"
          alt="Whotops Logo"
          width={120}
          height={60}
        /></Link>
        </header>
      <div className="bg-[#0f0f0f] shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h2 className="flex justify-between text-2xl text-white font-semibold w-full">{groupName}<button
        className="self-start p-2 text-white text-sm opacity-50 hover:opacity-100"
        onClick={() => router.push("/dashboard")}
      >
        ← Back to Dashboard
      </button></h2>

        {loading ? (
          <p className="text-gray-400 pt-8">Loading...</p>
        ) : membersData.length > 0 ? (
          <table className="min-w-full bg-[#0f0f0f] shadow-md rounded-lg overflow-hidden mt-4">
            <thead className="bg-[#2b2b2b] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Rank</th>
                <th className="py-3 px-6 text-left">Handle</th>
                <th className="py-3 px-6 text-left">Weekly Solved</th>
              </tr>
            </thead>
            <tbody>
              {membersData.map(({ handle, weeklySolved }, index) => (
                <tr key={handle} className="text-white">
                  <td className="py-3 px-6 font-bold">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : index + 1}
                  </td>
                  <td className="py-3 px-6 font-normal text-[#e96eff]">
                    {handle}
                  </td>
                  <td className="py-3 px-6 text-green-600">{weeklySolved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 mt-4">No data available.</p>
        )}
      </div>
    </main>
  );
}

// Wrap inside Suspense
export default function GroupPage() {
  return (
    <Suspense fallback={<p className="text-white">Loading Group...</p>}>
      <GroupPageContent />
    </Suspense>
  );
}
