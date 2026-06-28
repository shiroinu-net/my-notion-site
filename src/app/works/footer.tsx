'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function WorksFooter() {
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const check = () => setScrollable(document.documentElement.scrollHeight > window.innerHeight);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!scrollable) return null;

  return (
    <div
      style={{
        marginTop: 'clamp(40px,6vh,72px)',
        paddingTop: 22,
        borderTop: '1px solid rgba(110,134,155,.28)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link
        href="/#works"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: '.12em',
          fontStyle: 'italic',
          color: 'var(--rs-slate4)',
        }}
      >
        ← back to home
      </Link>
      <a
        href="#"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: '.12em',
          fontStyle: 'italic',
          color: 'var(--rs-slate4)',
        }}
      >
        ↑ top
      </a>
    </div>
  );
}
