import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../jobs/data/repositories/job_repository.dart';
import '../../../../core/providers/api_provider.dart';

final jobRepositoryProvider = Provider<JobRepository>((ref) {
  return JobRepository(ref.watch(apiClientProvider));
});

class DashboardState {
  final Map<String, dynamic> stats;
  final List<dynamic> activeJobs;
  final bool isLoading;
  final String? error;

  DashboardState({
    this.stats = const {},
    this.activeJobs = const [],
    this.isLoading = false,
    this.error,
  });

  DashboardState copyWith({
    Map<String, dynamic>? stats,
    List<dynamic>? activeJobs,
    bool? isLoading,
    String? error,
  }) {
    return DashboardState(
      stats: stats ?? this.stats,
      activeJobs: activeJobs ?? this.activeJobs,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class DashboardNotifier extends StateNotifier<DashboardState> {
  final JobRepository _repository;

  DashboardNotifier(this._repository) : super(DashboardState()) {
    refreshDashboard();
  }

  Future<void> refreshDashboard() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final stats = await _repository.getEmployerStats();
      final jobs = await _repository.getEmployerJobs();
      print('Dashboard stats: $stats');
      print('Dashboard jobs: ${jobs.length} jobs found');
      state = state.copyWith(
        isLoading: false,
        stats: stats,
        activeJobs: jobs,
      );
    } catch (e) {
      print('Dashboard error: $e');
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final dashboardProvider = StateNotifierProvider<DashboardNotifier, DashboardState>((ref) {
  return DashboardNotifier(ref.watch(jobRepositoryProvider));
});
