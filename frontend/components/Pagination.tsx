'use client';

interface PaginationProps {
  current: number;
  total: number;
  onPage: (page: number) => void;
}

export default function Pagination({ current, total, onPage }: PaginationProps) {
  if (total <= 1) return null;

  const pages: (number | '…')[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) {
      pages.push(i);
    } else if (Math.abs(i - current) === 2) {
      pages.push('…');
    }
  }

  // Deduplicate ellipses
  const deduped = pages.filter((p, i) => !(p === '…' && pages[i - 1] === '…'));

  return (
    <div className="pagination">
      <button
        className="pg-btn"
        disabled={current === 1}
        onClick={() => onPage(current - 1)}
      >
        ‹
      </button>

      {deduped.map((p, i) =>
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
