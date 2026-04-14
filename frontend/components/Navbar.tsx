'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const [apiStatus, setApiStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const [statusText, setStatusText] = useState('Connecting…');

  useEffect(() => {
    async function checkApi() {
      try {
        const res = await fetch(`${API_BASE}/repos`, {
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          setApiStatus('connected');
          setStatusText('API Online');
        } else {
          throw new Error();
        }
      } catch {
        setApiStatus('error');
        setStatusText('API Offline');
      }
    }
    checkApi();
  }, []);

  return (
    <nav className="navbar" id="navbar">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="logo-text">
            Dev<em>Search</em>
          </span>
        </Link>

        <div className="nav-center">
          <Link href="/" className={`nav-pill${pathname === '/' ? ' active' : ''}`}>
            Home
          </Link>
          <Link href="/repos" className={`nav-pill${pathname === '/repos' ? ' active' : ''}`}>
            Browse
          </Link>
          <Link href="/about" className={`nav-pill${pathname === '/about' ? ' active' : ''}`}>
            About
          </Link>
        </div>

        <div className="nav-right">
          <div className={`api-status ${apiStatus}`}>
            <span className="status-dot" />
            <span className="status-text">{statusText}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
