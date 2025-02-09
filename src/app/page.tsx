"use client";

import { useState } from "react";
import { fetchUserSubmissions, UserSolvedProblems } from "@/lib/codeforces";

export default function Home() {
  const [handles, setHandles] = useState<string>("");
  const [usersData, setUsersData] = useState<UserSolvedProblems[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const handlesList = handles.split(",").map((h) => h.trim()).filter((h) => h);
    if (handlesList.length === 0) return;

    setLoading(true);
    const results = await Promise.all(handlesList.map(fetchUserSubmissions));
    
    // Sort by problems solved (descending), keeping errors at the bottom
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
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-4">Whotops</h1>
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter handles (comma separated)"
          value={handles}
          onChange={(e) => setHandles(e.target.value)}
        />
        <button
          className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Leaderboard"}
        </button>
      </div>

      {usersData.length > 0 && (
        <div className="mt-6 w-full max-w-2xl overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-purple-500 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Rank</th>
                <th className="py-3 px-6 text-left">Handle</th>
                <th className="py-3 px-6 text-left">Problems Solved</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map(({ handle, solvedProblems, error }, index) => (
                <tr key={handle} className="border-b">
                  <td className="py-3 px-6">{error ? "-" : index + 1}</td>
                  <td className="py-3 px-6 font-semibold">{handle}</td>
                  <td className={`py-3 px-6 ${error ? "text-red-500" : "text-green-600"}`}>
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
