import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../jobs/data/repositories/job_repository.dart';
import '../../../dashboard/presentation/providers/dashboard_provider.dart';

class WorkerDashboardState {
  final Map<String, dynamic> stats;
  final List<dynamic> applications;
  final bool isLoading;
  final String? error;

  WorkerDashboardState({
    this.stats = const {},
    this.applications = const [],
    this.isLoading = false,
    this.error,
  });

  WorkerDashboardState copyWith({
    Map<String, dynamic>? stats,
    List<dynamic>? applications,
    bool? isLoading,
    String? error,
  }) {
    return WorkerDashboardState(
      stats: stats ?? this.stats,
      applications: applications ?? this.applications,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class WorkerDashboardNotifier extends StateNotifier<WorkerDashboardState> {
  final JobRepository _repository;

  WorkerDashboardNotifier(this._repository) : super(WorkerDashboardState()) {
    refreshDashboard();
  }

  Future<void> refreshDashboard() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final stats = await _repository.getWorkerStats();
      final applications = await _repository.getMyApplications();
      state = state.copyWith(
        isLoading: false,
        stats: stats,
        applications: applications,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final workerDashboardProvider = StateNotifierProvider<WorkerDashboardNotifier, WorkerDashboardState>((ref) {
  return WorkerDashboardNotifier(ref.watch(jobRepositoryProvider));
});
