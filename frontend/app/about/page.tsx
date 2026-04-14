export default function AboutPage() {
  return (
    <div className="about-wrap">
      <div className="about-hero">
        <div className="about-eyebrow">About the project</div>
        <h2 className="about-title">
          Built for developers,
          <br />
          <em>by developers</em>
        </h2>
        <p className="about-lead">
          DevSearch is a full-stack GitHub repository search engine powered by TF-IDF scoring, NLP
          tokenization, and trie-based autocomplete — all served through a clean Express + MongoDB
          backend.
        </p>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h3>TF-IDF Ranking</h3>
          <p>
            Term frequency–inverse document frequency scoring with a popularity boost ensures the
            most relevant repositories surface first.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <h3>NLP Processing</h3>
          <p>
            Text cleaning, stopword removal, and stemming via the Natural library ensure precise
            token matching across all indexed repositories.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <h3>Trie Autocomplete</h3>
          <p>
            Prefix-tree based autocomplete delivers instant query suggestions as you type, without
            any server round-trips.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
          <h3>MongoDB Storage</h3>
          <p>
            Repositories and inverted indexes stored in MongoDB for fast retrieval, complemented by
            in-memory caching for hot queries.
          </p>
        </div>
      </div>

      <div className="api-section">
        <h3 className="api-section-title">
          <span className="mono">API Reference</span>
        </h3>
        <div className="endpoint-list">
          <div className="endpoint-item">
            <div className="endpoint-row">
              <span className="method-badge">GET</span>
              <code className="endpoint-path">/search?q={'{query}'}&page={'{n}'}&limit={'{n}'}</code>
            </div>
            <p className="endpoint-desc">
              Search repositories by keyword. Returns paginated, TF-IDF ranked results with
              relevance scores.
            </p>
          </div>

          <div className="endpoint-item">
            <div className="endpoint-row">
              <span className="method-badge">GET</span>
              <code className="endpoint-path">/repos</code>
            </div>
            <p className="endpoint-desc">
              List all indexed repositories up to 50 items. Used for browsing and the home preview.
            </p>
          </div>

          <div className="endpoint-item">
            <div className="endpoint-row">
              <span className="method-badge">GET</span>
              <code className="endpoint-path">/autocomplete?q={'{prefix}'}</code>
            </div>
            <p className="endpoint-desc">
              Returns autocomplete suggestions using trie-based prefix matching. Responds in
              milliseconds.
            </p>
          </div>
        </div>
      </div>

      <div className="tech-footer">
        <p>
          Built with <strong>Express 5</strong> · <strong>Mongoose 9</strong> ·{' '}
          <strong>Natural NLP</strong> · <strong>Octokit</strong> · <strong>MongoDB</strong>
        </p>
      </div>
    </div>
  );
}
