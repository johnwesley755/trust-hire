export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  jobs: {
    all: ['jobs'] as const,
    list: (filters?: Record<string, any>) => ['jobs', 'list', filters || {}] as const,
    detail: (id: string) => ['jobs', 'detail', id] as const,
    employer: ['jobs', 'employer'] as const,
    stats: ['jobs', 'stats'] as const,
  },
  applications: {
    all: ['applications'] as const,
    my: ['applications', 'my'] as const,
    byJob: (jobId: string) => ['applications', 'job', jobId] as const,
    byJobs: (jobIds: string[]) => ['applications', 'by-jobs', jobIds] as const,
  },
  workers: {
    all: ['workers'] as const,
    search: (params?: Record<string, any>) => ['workers', 'search', params || {}] as const,
    detail: (id: string) => ['workers', 'detail', id] as const,
    me: ['workers', 'me'] as const,
    scoring: (id: string) => ['workers', 'scoring', id] as const,
  },
  employers: {
    all: ['employers'] as const,
    me: ['employers', 'me'] as const,
    detail: (id: string) => ['employers', 'detail', id] as const,
    stats: ['employers', 'stats'] as const,
  },
  skillTests: {
    all: ['skill-tests'] as const,
    detail: (id: string) => ['skill-tests', 'detail', id] as const,
    results: (workerId: string) => ['skill-tests', 'results', workerId] as const,
  },
  levels: {
    progression: ['levels', 'progression'] as const,
    worker: (workerId: string) => ['levels', 'worker', workerId] as const,
    requirements: ['levels', 'requirements'] as const,
  },
  verification: {
    status: ['verification', 'status'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
  },
  ratings: {
    ratee: (rateeId: string) => ['ratings', 'ratee', rateeId] as const,
    job: (jobId: string) => ['ratings', 'job', jobId] as const,
    summary: (userId: string) => ['ratings', 'summary', userId] as const,
  },
  dashboard: {
    metrics: (role: string) => ['dashboard', role] as const,
  },
  settings: {
    all: ['settings'] as const,
  },
  activities: {
    recent: ['activities', 'recent'] as const,
    user: (userId: string) => ['activities', 'user', userId] as const,
  },
};
