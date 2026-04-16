import { useState } from 'react';
import styles from './SearchControls.module.css';

const DATE_OPTIONS = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 14 days', value: 14 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 60 days', value: 60 },
  { label: 'Last 90 days', value: 90 },
];

const PER_PAGE_OPTIONS = [25, 50, 100, 250, 500];

export default function SearchControls({ onSearch, loading }) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [datePosted, setDatePosted] = useState(30);
  const [resultsPerPage, setResultsPerPage] = useState(100);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch({ keyword, location, datePosted, resultsPerPage });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="keyword">Keyword</label>
          <input
            id="keyword"
            type="text"
            placeholder="e.g. Software Engineer"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Washington, DC"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="datePosted">Date Posted</label>
          <select
            id="datePosted"
            value={datePosted}
            onChange={e => setDatePosted(Number(e.target.value))}
          >
            {DATE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="resultsPerPage">Results per call</label>
          <select
            id="resultsPerPage"
            value={resultsPerPage}
            onChange={e => setResultsPerPage(Number(e.target.value))}
          >
            {PER_PAGE_OPTIONS.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.searchBtn} disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>
    </form>
  );
}
