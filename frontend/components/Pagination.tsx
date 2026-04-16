'use client';

interface PaginationProps {
  current: number;
  total: number;
  onPage: (page: number) => void;
}

export default function Pagination({ current, total, onPage }: PaginationProps) {
  if (total <= 1) return null;

  const pages: (number | '…')[] = [];

  const range = 2; // 🔥 show ±2 pages

  const start = Math.max(2, current - range);
  const end = Math.min(total - 1, current + range);

  // Always include first page
  pages.push(1);

  // Left ellipsis
  if (start > 2) {
    pages.push('…');
  }

  // Middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Right ellipsis
  if (end < total - 1) {
    pages.push('…');
  }

  // Always include last page (if more than 1)
  if (total > 1) {
    pages.push(total);
  }

  return (
    <div className="pagination">
      <button
        className="pg-btn"
        disabled={current === 1}
        onClick={() => onPage(current - 1)}
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <button key={`ellipsis-${i}`} className="pg-btn" disabled>
            …
          </button>
        ) : (
          <button
            key={p}
            className={`pg-btn${p === current ? ' active' : ''}`}
            onClick={() => onPage(p as number)}
          >
            {p}
          </button>
        )
      )}

      <button
        className="pg-btn"
        disabled={current === total}
        onClick={() => onPage(current + 1)}
      >
        ›
      </button>
    </div>
  );
}