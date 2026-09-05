import apiClient from '../api/apiClient';
import type { Job } from '../types';
import type { WorkerPreferences } from '../modules/profile/components/PreferencesModal';

export interface RecommendedJob extends Job {
  matchPercentage: number;
  matchReasons: string[];
}

export const recommendationService = {
  getRecommendedJobs: async (preferences?: WorkerPreferences): Promise<RecommendedJob[]> => {
    // 1. Fetch available jobs
    const res = await apiClient.get<any>('/api/search/jobs');
    const jobsList: Job[] = Array.isArray(res.data) ? res.data : (res.data?.data || []);

    const userPrefs: WorkerPreferences = preferences || (() => {
      const saved = localStorage.getItem('worker_job_preferences');
      return saved ? JSON.parse(saved) : {
        skills: ['Electrician', 'Plumber', 'Carpenter'],
        minHourlyRate: 200,
        maxDistanceKm: 25,
        preferredCity: 'Chennai',
        jobTypes: ['Full-time'],
        availability: 'IMMEDIATE'
      };
    })();

    // 2. Score and rank jobs
    const scoredJobs: RecommendedJob[] = jobsList.map((job) => {
      let score = 50; // Base score
      const reasons: string[] = [];

      // Skill match
      const reqSkills = Array.isArray(job.requiredSkills) 
        ? job.requiredSkills 
        : typeof job.requiredSkills === 'string' 
          ? (job.requiredSkills as string).split(',').map(s => s.trim()) 
          : [];

      const matchingSkills = userPrefs.skills.filter(s => 
        reqSkills.some(rs => rs.toLowerCase().includes(s.toLowerCase())) ||
        job.title.toLowerCase().includes(s.toLowerCase()) ||
        job.description?.toLowerCase().includes(s.toLowerCase())
      );

      if (matchingSkills.length > 0) {
        score += 30;
        reasons.push(`Matches your skills: ${matchingSkills.join(', ')}`);
      }

      // Location match
      if (job.city && userPrefs.preferredCity && job.city.toLowerCase().includes(userPrefs.preferredCity.toLowerCase())) {
        score += 15;
        reasons.push(`In your preferred city: ${job.city}`);
      }

      // Budget match
      if (job.budget && job.budget >= userPrefs.minHourlyRate * 8) {
        score += 5;
        reasons.push(`Rate matches your expected pay`);
      }

      const matchPercentage = Math.min(score, 99);
      return {
        ...job,
        matchPercentage,
        matchReasons: reasons.length > 0 ? reasons : ['Matches current workforce demand in your region']
      };
    });

    // Sort by match percentage descending
    scoredJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return scoredJobs;
  }
};
