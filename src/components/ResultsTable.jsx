import { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/dataProcessing';
import styles from './ResultsTable.module.css';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function ResultsTable({ jobs }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = jobs.slice((safePage - 1) * pageSize, safePage * pageSize);

  function handlePageSize(e) {
    setPageSize(Number(e.target.value));
    setPage(1);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Live Results</h2>
        <div className={styles.controls}>
          <label>
            Rows per page&nbsp;
            <select value={pageSize} onChange={handlePageSize} className={styles.select}>
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <span className={styles.info}>
            {jobs.length === 0 ? '0 results' : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, jobs.length)} of ${jobs.length}`}
          </span>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Organization</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Posted</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>No results — run a search above.</td>
              </tr>
            ) : (
              slice.map(job => (
                <tr key={job.id}>
                  <td className={styles.titleCell}>{job.title}</td>
                  <td>{job.org}</td>
                  <td>{job.locations[0] ?? '—'}</td>
                  <td className={styles.salary}>
                    {job.salaryMin != null
                      ? `${formatCurrency(job.salaryMin)} – ${formatCurrency(job.salaryMax)}`
                      : '—'}
                    {job.salaryType && job.salaryMin != null ? <span className={styles.tag}>{job.salaryType}</span> : null}
                  </td>
                  <td className={styles.date}>{formatDate(job.postedDate)}</td>
                  <td>
                    {job.url
                      ? <a href={job.url} target="_blank" rel="noopener noreferrer" className={styles.link}>View ↗</a>
                      : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button onClick={() => setPage(1)} disabled={safePage === 1} className={styles.pgBtn}>«</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className={styles.pgBtn}>‹</button>
          <span className={styles.pgInfo}>Page {safePage} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className={styles.pgBtn}>›</button>
          <button onClick={() => setPage(totalPages)} disabled={safePage === totalPages} className={styles.pgBtn}>»</button>
        </div>
      )}
    </div>
  );
}
