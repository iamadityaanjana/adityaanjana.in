import { NextRequest, NextResponse } from "next/server";

const USERNAME_RE = /^[a-zA-Z0-9-]{1,39}$/;

const LEVELS = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
] as const;

type ContributionLevel = (typeof LEVELS)[number];

interface ContributionDay {
  color: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
  date: string;
}

interface FlatDay {
  date: string;
  count: number;
  level: number;
}

function toIsoDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseUtcDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function mapDay(day: FlatDay): ContributionDay {
  const level = Math.min(Math.max(day.level, 0), 4);
  return {
    color: "",
    contributionCount: day.count,
    contributionLevel: LEVELS[level],
    date: day.date,
  };
}

function toWeeks(days: FlatDay[]): ContributionDay[][] {
  if (days.length === 0) return [];

  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const prefix: FlatDay[] = [];
  const suffix: FlatDay[] = [];

  const firstDate = parseUtcDate(sorted[0].date);
  for (let i = firstDate.getUTCDay(); i > 0; i--) {
    const prior = new Date(firstDate);
    prior.setUTCDate(firstDate.getUTCDate() - i);
    prefix.push({ date: toIsoDate(prior), count: 0, level: 0 });
  }

  const lastDate = parseUtcDate(sorted[sorted.length - 1].date);
  const lastWeekday = lastDate.getUTCDay();
  for (let i = lastWeekday + 1; i <= 6; i++) {
    const next = new Date(lastDate);
    next.setUTCDate(lastDate.getUTCDate() + (i - lastWeekday));
    suffix.push({ date: toIsoDate(next), count: 0, level: 0 });
  }

  const padded = [...prefix, ...sorted, ...suffix];

  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7).map(mapDay));
  }
  return weeks;
}

async function fromJogruber(username: string): Promise<{
  contributions: ContributionDay[][];
  totalContributions: number;
} | null> {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    { next: { revalidate: 3600 } }
  );
  if (!response.ok) return null;

  const json = (await response.json()) as {
    total?: { lastYear?: number };
    contributions?: FlatDay[];
  };
  const days = json.contributions ?? [];
  if (days.length === 0) return null;

  return {
    contributions: toWeeks(days),
    totalContributions:
      json.total?.lastYear ?? days.reduce((sum, day) => sum + day.count, 0),
  };
}

function fromGithubHtml(html: string): {
  contributions: ContributionDay[][];
  totalContributions: number;
} | null {
  const days = new Map<string, FlatDay>();
  const cellRe =
    /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"|data-level="(\d)"[^>]*data-date="(\d{4}-\d{2}-\d{2})"/g;

  for (const match of html.matchAll(cellRe)) {
    const date = match[1] || match[4];
    const level = Number(match[2] || match[3] || 0);
    if (!date) continue;
    days.set(date, {
      date,
      count: level === 0 ? 0 : level,
      level,
    });
  }

  if (days.size === 0) return null;

  const totalMatch = html.match(/([\d,]+)\s+contributions\s+in the last year/i);
  const parsedTotal = totalMatch
    ? Number(totalMatch[1].replace(/,/g, ""))
    : [...days.values()].reduce((sum, day) => sum + day.count, 0);

  return {
    contributions: toWeeks([...days.values()]),
    totalContributions: Number.isFinite(parsedTotal) ? parsedTotal : 0,
  };
}

async function fromGithub(username: string): Promise<{
  contributions: ContributionDay[][];
  totalContributions: number;
} | null> {
  const response = await fetch(
    `https://github.com/users/${username}/contributions`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; adityaanjana.in contribution graph)",
        Accept: "text/html",
      },
      next: { revalidate: 3600 },
    }
  );
  if (!response.ok) return null;
  return fromGithubHtml(await response.text());
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") ?? "";
  if (!USERNAME_RE.test(username)) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  try {
    const data =
      (await fromJogruber(username)) ?? (await fromGithub(username));

    if (!data) {
      return NextResponse.json(
        { error: "Failed to fetch GitHub contributions" },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch GitHub contributions" },
      { status: 502 }
    );
  }
}
