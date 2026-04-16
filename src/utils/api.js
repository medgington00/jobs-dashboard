const BASE_URL = 'https://data.usajobs.gov/api/search';

function getCredentials() {
  return {
    apiKey: window.__USAJOBS_KEY__ || import.meta.env.VITE_USAJOBS_API_KEY || '',
    userAgent: window.__USAJOBS_UA__ || import.meta.env.VITE_USAJOBS_USER_AGENT || '',
  };
}

export async function fetchJobs({ keyword = '', location = '', datePosted = 30, page = 1, resultsPerPage = 25 } = {}) {
  const { apiKey, userAgent } = getCredentials();
  if (!apiKey || !userAgent) throw new Error('API credentials not configured. Use the ⚙ Config panel to set your USAJobs API key and email.');

  const params = new URLSearchParams({
    ResultsPerPage: resultsPerPage,
    Page: page,
  });

  if (keyword) params.set('Keyword', keyword);
  if (location) params.set('LocationName', location);
  if (datePosted) params.set('DatePosted', datePosted);

  const res = await fetch(`${BASE_URL}?${params}`, {
    headers: {
      'Authorization-Key': apiKey,
      'User-Agent': userAgent,
      'Host': 'data.usajobs.gov',
    },
  });

  if (!res.ok) throw new Error(`USAJobs API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchAllJobs(searchParams) {
  const pageSize = 500;
  const firstPage = await fetchJobs({ ...searchParams, resultsPerPage: pageSize, page: 1 });
  const total = parseInt(firstPage?.SearchResult?.SearchResultCountAll ?? '0', 10);
  const firstItems = firstPage?.SearchResult?.SearchResultItems ?? [];

  if (total <= pageSize) return { items: firstItems, total };

  const totalPages = Math.ceil(Math.min(total, 1000) / pageSize);
  const remaining = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      fetchJobs({ ...searchParams, resultsPerPage: pageSize, page: i + 2 })
        .then(r => r?.SearchResult?.SearchResultItems ?? [])
    )
  );

  return { items: [...firstItems, ...remaining.flat()], total };
}
