'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface NowPlayingData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
}

function formatMs(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [progress, setProgress] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNowPlaying = async () => {
    try {
      const res = await fetch('/api/spotify');
      const json: NowPlayingData = await res.json();
      setData(json);
      setProgress(json.progressMs ?? 0);
    } catch {
      setData({ isPlaying: false });
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const pollInterval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (data?.isPlaying) {
      tickRef.current = setInterval(() => {
        setProgress((p) => {
          const next = p + 1000;
          return data.durationMs ? Math.min(next, data.durationMs) : next;
        });
      }, 1000);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [data]);

  const percent =
    data?.durationMs && data.durationMs > 0
      ? Math.min((progress / data.durationMs) * 100, 100)
      : 0;

  if (!data || !data.isPlaying) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
        <SpotifyIcon className="w-4 h-4" />
        <span>Not playing</span>
      </div>
    );
  }

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col w-full rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors p-4 gap-4"
    >
      {/* Top row: album art + info */}
      <div className="flex items-center gap-4">
        {data.albumImageUrl ? (
          <div className="relative w-16 h-16 shrink-0">
            <Image
              src={data.albumImageUrl}
              alt={data.album || 'Album art'}
              fill
              sizes="64px"
              className="rounded-lg object-cover shadow-md"
            />
          </div>
        ) : (
          <div className="w-16 h-16 shrink-0 rounded-lg bg-neutral-300 dark:bg-neutral-600" />
        )}

        {/* Title / artist / spotify badge — vertically centered */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <SpotifyIcon className="w-3.5 h-3.5 text-green-500 shrink-0" />
            <span className="text-xs text-green-500 font-semibold tracking-wide">Now Playing</span>
          </div>
          <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100 truncate leading-tight">
            {data.title}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
            {data.artist}
          </p>
        </div>
      </div>

      {/* Progress bar + timestamps */}
      <div className="flex flex-col gap-1.5 w-full">
        <div className="w-full h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-400 dark:text-neutral-500 tabular-nums">
          <span>{formatMs(progress)}</span>
          <span>{formatMs(data.durationMs ?? 0)}</span>
        </div>
      </div>
    </a>
  );
}
