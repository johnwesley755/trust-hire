import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/job_repository.dart';
import '../../../dashboard/presentation/providers/dashboard_provider.dart';

class JobSearchState {
  final List<dynamic> jobs;
  final bool isLoading;
  final String? error;

  JobSearchState({
    this.jobs = const [],
    this.isLoading = false,
    this.error,
  });

  JobSearchState copyWith({
    List<dynamic>? jobs,
    bool? isLoading,
    String? error,
  }) {
    return JobSearchState(
      jobs: jobs ?? this.jobs,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class JobSearchNotifier extends StateNotifier<JobSearchState> {
  final JobRepository _repository;

  JobSearchNotifier(this._repository) : super(JobSearchState()) {
    search('');
  }

  Future<void> search(String query) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final jobs = await _repository.searchJobs(query: query);
      state = state.copyWith(isLoading: false, jobs: jobs);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final jobSearchProvider = StateNotifierProvider<JobSearchNotifier, JobSearchState>((ref) {
  return JobSearchNotifier(ref.watch(jobRepositoryProvider));
});
