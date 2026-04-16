import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { postingsByDate } from '../utils/dataProcessing';
import styles from './Panel.module.css';

function formatAxisDate(str) {
  if (!str) return '';
  const [, m, d] = str.split('-');
  return `${m}/${d}`;
}

export default function PostingVolumeChart({ jobs }) {
  const data = postingsByDate(jobs);

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Posting Volume by Date</h2>
      {data.length === 0 ? (
        <p className={styles.empty}>No data</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatAxisDate}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6 }}
              labelStyle={{ color: 'var(--text-muted)' }}
              itemStyle={{ color: 'var(--text)' }}
              labelFormatter={v => `Date: ${v}`}
            />
            <Bar dataKey="count" fill="var(--accent)" radius={[3, 3, 0, 0]} name="Postings" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
