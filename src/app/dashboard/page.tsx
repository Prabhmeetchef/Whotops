"use client";
import { useState, useEffect } from "react";
import { fetchUserData, UserData } from "@/lib/codeforces";
import { useRouter } from "next/navigation";

interface Group {
  name: string;
  member: string[]; // Array of handles
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupMembersData, setGroupMembersData] = useState<UserData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handle = localStorage.getItem("userHandle");
    if (!handle) {
      router.push("/"); // Redirect to login if no handle found
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
      console.log("Fetched groups data:", data.groups); // Debugging log

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

  const openGroupModal = async (group: Group) => {
    setSelectedGroup(group);
    setGroupMembersData([]); // Reset previous data

    const membersData = await Promise.all(
      group.member.map(async (handle) => {
        const userData = await fetchUserData(handle);
        return userData;
      })
    );

    // Sort members by weekly solved (descending)
    const sortedData = membersData
      .filter((user) => !user.error) // Remove users with errors
      .sort((a, b) => b.weeklySolved - a.weeklySolved);

    setGroupMembersData(sortedData);
  };

  const closeModal = () => {
    setSelectedGroup(null);
    setGroupMembersData([]);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-black">
      <div className="bg-[#0f0f0f] shadow-lg rounded-lg p-6 w-full max-w-2xl text-center">
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        {loading ? (
          <p className="text-gray-400 mt-4">Loading...</p>
        ) : userData ? (
          <div className="mt-4 text-white">
            <p className="text-lg font-semibold">{userData.handle}</p>
            <p>Total Solved: {userData.totalSolved}</p>
            <p>Solved This Week: {userData.weeklySolved}</p>
            {userData.error && <p className="text-red-500">{userData.error}</p>}
          </div>
        ) : (
          <p className="text-gray-400 mt-4">No user data available.</p>
        )}

        {/* Group Section */}
        <div className="mt-6 w-full">
          <h2 className="text-lg text-purple-400 font-semibold mb-2">
            Your Groups
          </h2>
          {groups.length > 0 ? (
            <table className="w-full border-collapse border border-gray-600 text-white">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-600 px-4 py-2">Group Name</th>
                  <th className="border border-gray-600 px-4 py-2">Members</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group, index) => (
                  <tr
                    key={index}
                    className="border border-gray-600 cursor-pointer hover:bg-gray-700"
                    onClick={() => openGroupModal(group)}
                  >
                    <td className="border border-gray-600 px-4 py-2">{group.name}</td>
                    <td className="border border-gray-600 px-4 py-2">{group.member.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">You are not in any groups.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-[#0f0f0f] p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-white text-2xl font-bold">{selectedGroup.name}</h2>
            <button className="text-red-500 float-right" onClick={closeModal}>
              ✖
            </button>
            <table className="min-w-full bg-[#0f0f0f] shadow-md rounded-lg overflow-hidden mt-4">
              <thead className="bg-[#2b2b2b] text-white">
                <tr>
                  <th className="py-3 px-6 text-left">Rank</th>
                  <th className="py-3 px-6 text-left">Handle</th>
                  <th className="py-3 px-6 text-left">Weekly Solved</th>
                </tr>
              </thead>
              <tbody>
                {groupMembersData.map(({ handle, weeklySolved }, index) => (
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
          </div>
        </div>
      )}
    </main>
  );
}
