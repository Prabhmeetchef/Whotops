export interface Submission {
  id: number;
  problem: {
    name: string;
    contestId: number;
    index: string;
  };
  verdict: string;
  creationTimeSeconds: number;
}

export interface UserData {
  handle: string;
  totalSolved: number;
  weeklySolved: number;
  error?: string;
}

export const fetchUserData = async (handle: string): Promise<UserData> => {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
    );
    const data = await response.json();
    if (data.status !== "OK") {
      return { handle, totalSolved: 0, weeklySolved: 0, error: "Invalid user handle." };
    }

    const solvedProblems = new Set<string>();
    const weeklySolved = new Set<string>();
    const oneWeekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;

    data.result.forEach((submission: Submission) => {
      if (submission.verdict === "OK") {
        const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
        solvedProblems.add(problemId);
        if (submission.creationTimeSeconds >= oneWeekAgo) {
          weeklySolved.add(problemId);
        }
      }
    });

    return {
      handle,
      totalSolved: solvedProblems.size,
      weeklySolved: weeklySolved.size,
    };
  } catch (error) {
    console.error(`Error fetching data for ${handle}:`, error);
    return { handle, totalSolved: 0, weeklySolved: 0, error: "Failed to fetch data." };
  }
};