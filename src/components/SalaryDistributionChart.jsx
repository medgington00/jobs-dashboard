import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { salaryBuckets } from '../utils/dataProcessing';
import styles from './Panel.module.css';

export default function SalaryDistributionChart({ jobs }) {
  const data = salaryBuckets(jobs);

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Salary Distribution (Annual, PA)</h2>
      {data.length === 0 ? (
        <p className={styles.empty}>No annual salary data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="range" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={44} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6 }}
              labelStyle={{ color: 'var(--text-muted)' }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} />
            <Bar dataKey="minCount" fill="var(--accent)" radius={[3, 3, 0, 0]} name="Min Salary" />
            <Bar dataKey="maxCount" fill="var(--accent2)" radius={[3, 3, 0, 0]} name="Max Salary" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
