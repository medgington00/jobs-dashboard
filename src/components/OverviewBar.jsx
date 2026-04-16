import { computeOverview, formatCurrency, formatDate } from '../utils/dataProcessing';
import styles from './OverviewBar.module.css';

function Stat({ label, value }) {
  return (
    <div className={styles.stat}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

export default function OverviewBar({ jobs, total, lastFetched }) {
  const { dateMin, dateMax, avgMin, avgMax } = computeOverview(jobs);

  return (
    <div className={styles.bar}>
      <Stat label="Total Postings" value={total.toLocaleString()} />
      <Stat label="Loaded" value={jobs.length.toLocaleString()} />
      <Stat label="Date Range" value={dateMin ? `${formatDate(dateMin)} – ${formatDate(dateMax)}` : '—'} />
      <Stat label="Avg Min Salary" value={formatCurrency(avgMin)} />
      <Stat label="Avg Max Salary" value={formatCurrency(avgMax)} />
      {lastFetched && (
        <Stat label="Last Refreshed" value={lastFetched.toLocaleTimeString()} />
      )}
    </div>
  );
}
