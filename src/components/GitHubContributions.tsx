"use client";

import React from "react";
import GitHubCalendar from "react-github-calendar";

interface GitHubContributionsProps {
  username: string;
}

const GitHubContributions: React.FC<GitHubContributionsProps> = ({ username }) => {
  const fromJanToToday = (contributions: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[]) => {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01`);
    const today = new Date();

    return contributions.filter(activity => {
      const date = new Date(activity.date);
      return date >= startDate && date <= today;
    });
  };

  return (
    <div className="w-full flex justify-center items-center rounded-lg p-4 bg-[#0d1117] border border-[#21262d] shadow-inner overflow-hidden">
      <div className="max-w-full overflow-x-auto">
        <GitHubCalendar
          username={username}
          transformData={fromJanToToday}
          blockSize={12}
          blockMargin={4}
          colorScheme="dark"
          fontSize={12}
          hideColorLegend
          labels={{
            totalCount: "{{count}} contributions in 2025",
          }}
        />
      </div>
    </div>
  );
};

export default GitHubContributions;
