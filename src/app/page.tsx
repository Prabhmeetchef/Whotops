"use client";
import Image from "next/image";
import { useState } from "react";
import { fetchWeeklySubmissions, UserSolvedProblems } from "@/lib/codeforces";

export default function Home() {
  const [handles, setHandles] = useState<string>("");
  const [usersData, setUsersData] = useState<UserSolvedProblems[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const handlesList = handles
      .split(",")
      .map((h) => h.trim())
      .filter((h) => h);
    if (handlesList.length === 0) return;

    setLoading(true);
    const results = await Promise.all(handlesList.map(fetchWeeklySubmissions));
    // Sort by weekly solved problems (descending)
    results.sort((a, b) => {
      if (a.error) return 1;
      if (b.error) return -1;
      return b.solvedProblems.size - a.solvedProblems.size;
    });
    setUsersData(results);
    setLoading(false);
  };
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-black">
      {/* Header Section */}
      <div className="bg-[#0f0f0f] shadow-lg rounded-lg p-6 w-full max-w-2xl text-center items-center justify-center flex flex-col">
        <Image src="/whotops_logo.png" alt="WhoTops Logo" width={600} height={80}></Image>
        {/* Handle Input */}
        <div className="flex flex-wrap gap-2 p-3 rounded bg-[#0f0f0f] mb-4">
          {handles.split(",").map((h, i) =>
            h.trim() ? (
              <span
                key={i}
                className="bg-purple-100 text-[#E23CFF] px-3 py-1 rounded-full text-sm font-medium"
              >
                {h.trim()}
              </span>
            ) : null
          )}
        </div>
        <input
          type="text"
          className="w-full border-gray-600 border-2 p-2 bg-[#0f0f0f] rounded focus:ring-2 focus:ring-purple-400 focus:outline-none mb-6 text-white"
          placeholder="Enter handles (comma separated)"
          value={handles}
          onChange={(e) => setHandles(e.target.value)}
        />
        <button
          className={`w-full px-4 py-2 rounded text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#E23CFF] hover:bg-[#E23CFF]"
          }`}
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Weekly Leaderboard"}
        </button>
      </div>

      {/* Leaderboard Table */}
      {usersData.length > 0 && (
        <div className="mt-6 w-full max-w-2xl overflow-x-auto">
          <table className="min-w-full bg-[#0f0f0f] shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#2b2b2b] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Rank</th>
                <th className="py-3 px-6 text-left">Handle</th>
                <th className="py-3 px-6 text-left">Weekly Solved</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map(({ handle, solvedProblems, error }, index) => (
                <tr
                  key={handle}
                  className={` ${
                    index === 0
                      ? "bg-[#0f0f0f]"
                      : index === 1
                      ? "bg-[#0f0f0f]"
                      : ""
                  }`}
                >
                  <td className="py-3 px-6 font-bold text-white">
                    {error
                      ? "-"
                      : index === 0
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
                  <td
                    className={`py-3 px-6 ${
                      error ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {error ? error : solvedProblems.size}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
