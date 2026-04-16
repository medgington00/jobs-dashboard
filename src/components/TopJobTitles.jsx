import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { topTitles } from '../utils/dataProcessing';
import styles from './Panel.module.css';

function truncate(str, n = 32) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

export default function TopJobTitles({ jobs }) {
  const data = topTitles(jobs, 10).reverse();

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Top Job Titles</h2>
      {data.length === 0 ? (
        <p className={styles.empty}>No data</p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(260, data.length * 36)}>
          <BarChart layout="vertical" data={data} margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={220}
              tick={{ fill: 'var(--text)', fontSize: 11 }}
              tickFormatter={v => truncate(v, 32)}
            />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6 }}
              labelStyle={{ color: 'var(--text)', fontSize: 12 }}
              itemStyle={{ color: 'var(--accent2)' }}
            />
            <Bar dataKey="count" fill="var(--accent2)" radius={[0, 3, 3, 0]} name="Postings" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
