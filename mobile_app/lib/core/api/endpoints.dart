class Endpoints {
  static const String baseUrl = "http://localhost:8080";

  // --- Auth ---
  static const String login = "/api/auth/login";
  static const String register = "/api/auth/register";
  static const String sendOtp = "/api/auth/send-otp";
  static const String sync = "/api/auth/sync";
  static const String me = "/api/auth/me";
  static const String forgotPassword = "/api/auth/forgot-password";
  static const String resetPassword = "/api/auth/reset-password";

  // --- Dashboard & Stats ---
  static const String workerDashboardStats = "/api/dashboard/worker/stats";
  static const String employerDashboardStats = "/api/dashboard/employer/stats";
  static const String globalWorkerStats = "/api/worker/stats";
  static const String trustScore = "/api/worker/trust-score"; // + /{userId}

  // --- Jobs ---
  static const String jobs = "/api/jobs"; // GET (all), POST (create)
  static const String jobById = "/api/jobs"; // + /{id}
  static const String employerActiveJobs = "/api/jobs/employer";
  
  // --- Job Applications ---
  static const String applyJob = "/api/jobs/applications"; // POST
  static const String myApplications = "/api/jobs/applications/my";
  static const String applicationStatus = "/api/jobs/applications"; // + /{id}/status
  static const String jobApplications = "/api/jobs/applications/job"; // + /{jobId}

  // --- Search ---
  static const String searchJobs = "/api/search/jobs";
  static const String searchWorkers = "/api/search/workers";

  // --- Worker Profiles ---
  static const String workerProfile = "/api/worker/profile"; // GET/PUT
  static const String workerProfilesByIds = "/api/worker/profiles/by-user-ids";
  static const String incrementProfileView = "/api/worker/profile"; // + /{userId}/view

  // --- Employer Profiles ---
  static const String employerProfile = "/api/employer/profile"; // GET/POST/PUT

  // --- Levels & Gamification ---
  static const String levelDetails = "/api/levels/worker"; // + /{userId}
  static const String levelProgress = "/api/levels/progress"; // + /{userId}

  // --- Skill Tests ---
  static const String availableTests = "/api/skill-tests/available";
  static const String testById = "/api/skill-tests"; // + /{id}
  static const String submitTest = "/api/skill-tests/submit";

  // --- Ratings ---
  static const String ratings = "/api/ratings"; // POST
  static const String userRatings = "/api/ratings/user"; // + /{userId}
  static const String myRatings = "/api/ratings/my";

  // --- Notifications ---
  static const String notifications = "/api/notifications";
  static const String unreadNotificationCount = "/api/notifications/unread/count";
  static const String markNotificationsRead = "/api/notifications/read-all";

  // --- Verification ---
  static const String uploadVerificationDoc = "/api/verification/upload-doc";
  static const String captureLiveVerification = "/api/verification/capture-live";
  static const String verificationStatus = "/api/verification/status";

  // --- Media & Shared ---
  static const String mediaUpload = "/api/media/upload";
  static const String activityRecent = "/api/activities/recent";
  static const String settings = "/api/settings"; // GET/PUT
  static const String changePassword = "/api/settings/password";
  static const String supportTicket = "/api/support/ticket";
}
