'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BackButton() {
  return (
    <Link
      href="/"
      className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 inline-flex items-center hover:underline transition-colors"
    >
      <span className="mr-2">←</span>
      <span>Back</span>
    </Link>
  );
}

