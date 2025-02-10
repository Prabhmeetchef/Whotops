export interface Submission {
  id: number;
  problem: {
    name: string;
    contestId: number;
    index: string;
  };
  verdict: string;
  creationTimeSeconds: number; // Add this field to match the API response
}

export interface UserSolvedProblems {
  handle: string;
  solvedProblems: Set<string>;
  error?: string; // New: To track errors per user
}

export const fetchWeeklySubmissions = async (handle: string): Promise<UserSolvedProblems> => {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
    );
    const data = await response.json();
    if (data.status !== "OK") {
      return { handle, solvedProblems: new Set(), error: "Invalid user handle." };
    }
    const solvedProblems = new Set<string>();
    const oneWeekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60; // Convert milliseconds → seconds
    data.result.forEach((submission: Submission) => {
      if (submission.verdict === "OK") {
        const submissionTime = submission.creationTimeSeconds; // Correct timestamp format
        if (submissionTime >= oneWeekAgo) {
          const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
          solvedProblems.add(problemId);
        }
      }
    });

    if (solvedProblems.size === 0) {
      return { handle, solvedProblems, error: "No problems solved in the last week." };
    }

    return { handle, solvedProblems };
  } catch (error) {
    console.error(`Error fetching data for ${handle}:`, error);
    return { handle, solvedProblems: new Set(), error: "Failed to fetch data." };
  }
};
