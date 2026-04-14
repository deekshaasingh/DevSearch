import { Repo, LANG_COLORS } from '@/lib/api';

interface RepoCardProps {
  repo: Repo;
  delay?: number;
}

export default function RepoCard({ repo, delay = 0 }: RepoCardProps) {
  const name = repo.name || 'Unknown';
  const owner = repo.owner || repo.fullName?.split('/')?.[0] || '';
  const desc = repo.description || 'No description provided.';
  const stars = (repo.stars || 0).toLocaleString();
  const lang = repo.language || '';
  const url = repo.url || '#';
  const topics = (repo.topics || []).slice(0, 4);
  const langColor = LANG_COLORS[lang] || '#524D6B';

  return (
    <a
      className="repo-card"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="card-top">
        <div className="card-name-wrap">
          {owner && <div className="card-owner">{owner}</div>}
          <div className="card-name">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            {name}
          </div>
        </div>
        <div className="card-stars">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {stars}
        </div>
      </div>

      <p className="card-desc">{desc}</p>

      <div className="card-footer">
        {lang && (
          <div className="card-lang">
            <span className="lang-dot" style={{ background: langColor }} />
            {lang}
          </div>
        )}
      </div>

      {topics.length > 0 && (
        <div className="card-topics">
          {topics.map((t) => (
            <span key={t} className="topic-pill">
              {t}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
