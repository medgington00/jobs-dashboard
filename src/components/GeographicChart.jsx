import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { topStates } from '../utils/dataProcessing';
import styles from './Panel.module.css';

export default function GeographicChart({ jobs }) {
  const data = topStates(jobs, 10);

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Geographic Breakdown (Top States)</h2>
      {data.length === 0 ? (
        <p className={styles.empty}>No data</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6 }}
              labelStyle={{ color: 'var(--text-muted)' }}
              itemStyle={{ color: 'var(--text)' }}
            />
            <Bar dataKey="count" fill="var(--accent2)" radius={[3, 3, 0, 0]} name="Postings" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
