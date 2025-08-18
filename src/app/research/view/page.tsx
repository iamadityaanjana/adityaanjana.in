'use client';

import { useEffect, useState } from 'react';

export default function PDFViewPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <iframe
        src="/research.pdf"
        className="w-full h-full border-0"
        title="Research PDF"
      />
    </div>
  );
}
