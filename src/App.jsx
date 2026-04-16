import { useState } from 'react';
import { useUSAJobs } from './hooks/useUSAJobs';
import SearchControls from './components/SearchControls';
import OverviewBar from './components/OverviewBar';
import PostingVolumeChart from './components/PostingVolumeChart';
import TopOrganizationsChart from './components/TopOrganizationsChart';
import GeographicChart from './components/GeographicChart';
import SalaryDistributionChart from './components/SalaryDistributionChart';
import TopJobTitles from './components/TopJobTitles';
import ResultsTable from './components/ResultsTable';
import styles from './App.module.css';

export default function App() {
  const { jobs, total, loading, error, lastFetched, search } = useUSAJobs();
  const [searchParams, setSearchParams] = useState(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_USAJOBS_API_KEY || '');
  const [userAgent, setUserAgent] = useState(import.meta.env.VITE_USAJOBS_USER_AGENT || '');
  const [keySaved, setKeySaved] = useState(!!(import.meta.env.VITE_USAJOBS_API_KEY));

  function handleSearch(params) {
    setSearchParams(params);
    search(params);
  }

  function handleRefresh() {
    if (searchParams) search(searchParams);
  }

  function handleSaveConfig() {
    window.__USAJOBS_KEY__ = apiKey;
    window.__USAJOBS_UA__ = userAgent;
    setKeySaved(true);
    setConfigOpen(false);
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.logo}>USAJobs Market Tracker</h1>
            <p className={styles.sub}>Federal job postings analysis · USAJobs API</p>
          </div>
          <div className={styles.headerActions}>
            {lastFetched && (
              <button className={styles.refreshBtn} onClick={handleRefresh} disabled={loading}>
                ↻ Refresh
              </button>
            )}
            <button className={`${styles.configBtn} ${!keySaved ? styles.configBtnAlert : ''}`} onClick={() => setConfigOpen(o => !o)}>
              ⚙ {keySaved ? 'Config' : 'Set API Key'}
            </button>
          </div>
        </div>
      </header>

      {configOpen && (
        <div className={styles.configPanel}>
          <div className={styles.configInner}>
            <h2 className={styles.configTitle}>API Configuration</h2>
            <p className={styles.configNote}>
              Credentials stay in-memory only. Get your free API key at{' '}
              <a href="https://developer.usajobs.gov/apirequest/" target="_blank" rel="noopener noreferrer">
                developer.usajobs.gov
              </a>.
            </p>
            <div className={styles.configRow}>
              <div className={styles.configField}>
                <label>Authorization-Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Your USAJobs API key"
                  autoComplete="off"
                />
              </div>
              <div className={styles.configField}>
                <label>User-Agent (Email)</label>
                <input
                  type="email"
                  value={userAgent}
                  onChange={e => setUserAgent(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="off"
                />
              </div>
              <button className={styles.configSave} onClick={handleSaveConfig} disabled={!apiKey || !userAgent}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={styles.main}>
        <section className={styles.section}>
          <SearchControls onSearch={handleSearch} loading={loading} />
        </section>

        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className={styles.loadingBar}>
            <span className={styles.spinner} /> Fetching job data…
          </div>
        )}

        {jobs.length > 0 && (
          <>
            <section className={styles.section}>
              <OverviewBar jobs={jobs} total={total} lastFetched={lastFetched} />
            </section>

            <section className={styles.grid2}>
              <PostingVolumeChart jobs={jobs} />
              <GeographicChart jobs={jobs} />
            </section>

            <section className={styles.grid2}>
              <TopOrganizationsChart jobs={jobs} />
              <TopJobTitles jobs={jobs} />
            </section>

            <section className={styles.section}>
              <SalaryDistributionChart jobs={jobs} />
            </section>

            <section className={styles.section}>
              <ResultsTable jobs={jobs} />
            </section>
          </>
        )}

        {!loading && jobs.length === 0 && !error && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📊</div>
            <p>Enter a keyword or location and click <strong>Search</strong> to load federal job market data.</p>
            {!keySaved && (
              <p className={styles.emptyHint}>Configure your USAJobs API credentials with <strong>⚙ Set API Key</strong> above.</p>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        Data from the{' '}
        <a href="https://developer.usajobs.gov/" target="_blank" rel="noopener noreferrer">
          USAJobs API
        </a>
        . Portfolio project.
      </footer>
    </div>
  );
}
