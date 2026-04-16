export function extractJobFields(item) {
  const m = item?.MatchedObjectDescriptor ?? {};
  const pay = m?.PositionRemuneration?.[0] ?? {};
  const loc = m?.PositionLocation ?? [];

  return {
    id: item?.MatchedObjectId ?? '',
    title: m?.PositionTitle ?? 'Unknown',
    org: m?.OrganizationName ?? m?.DepartmentName ?? 'Unknown',
    locations: loc.map(l => l?.LocationName ?? ''),
    state: loc[0]?.CountrySubDivisionCode ?? '',
    city: loc[0]?.CityName ?? '',
    salaryMin: parseFloat(pay?.MinimumRange) || null,
    salaryMax: parseFloat(pay?.MaximumRange) || null,
    salaryType: pay?.RateIntervalCode ?? '',
    postedDate: m?.PublicationStartDate?.slice(0, 10) ?? '',
    closeDate: m?.ApplicationCloseDate?.slice(0, 10) ?? '',
    url: m?.PositionURI ?? '',
  };
}

export function processJobs(items) {
  return items.map(extractJobFields);
}

export function computeOverview(jobs) {
  const dates = jobs.map(j => j.postedDate).filter(Boolean).sort();
  const salaryJobs = jobs.filter(j => j.salaryMin != null && j.salaryType === 'PA');
  const avgMin = salaryJobs.length
    ? salaryJobs.reduce((s, j) => s + j.salaryMin, 0) / salaryJobs.length
    : null;
  const avgMax = salaryJobs.length
    ? salaryJobs.reduce((s, j) => s + j.salaryMax, 0) / salaryJobs.length
    : null;

  return {
    total: jobs.length,
    dateMin: dates[0] ?? null,
    dateMax: dates[dates.length - 1] ?? null,
    avgMin,
    avgMax,
  };
}

export function postingsByDate(jobs) {
  const counts = {};
  for (const j of jobs) {
    if (j.postedDate) counts[j.postedDate] = (counts[j.postedDate] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function topOrganizations(jobs, n = 10) {
  const counts = {};
  for (const j of jobs) counts[j.org] = (counts[j.org] ?? 0) + 1;
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

export function topStates(jobs, n = 10) {
  const counts = {};
  for (const j of jobs) {
    if (j.state) counts[j.state] = (counts[j.state] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

export function salaryBuckets(jobs) {
  const annual = jobs.filter(j => j.salaryMin != null && j.salaryType === 'PA');
  if (!annual.length) return [];

  const bucketSize = 20000;
  const max = Math.max(...annual.map(j => j.salaryMax ?? j.salaryMin));
  const numBuckets = Math.ceil(max / bucketSize) + 1;
  const buckets = Array.from({ length: numBuckets }, (_, i) => ({
    range: `$${(i * bucketSize / 1000).toFixed(0)}k`,
    minCount: 0,
    maxCount: 0,
  }));

  for (const j of annual) {
    const minBucket = Math.floor(j.salaryMin / bucketSize);
    const maxBucket = Math.floor((j.salaryMax ?? j.salaryMin) / bucketSize);
    if (buckets[minBucket]) buckets[minBucket].minCount++;
    if (buckets[maxBucket]) buckets[maxBucket].maxCount++;
  }

  return buckets.filter(b => b.minCount > 0 || b.maxCount > 0);
}

export function topTitles(jobs, n = 10) {
  const counts = {};
  for (const j of jobs) {
    const t = j.title.trim();
    counts[t] = (counts[t] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

export function formatCurrency(val) {
  if (val == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}

export function formatDate(str) {
  if (!str) return '—';
  return new Date(str + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
