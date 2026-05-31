import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/job_repository.dart';
import '../../../dashboard/presentation/providers/dashboard_provider.dart';

class JobDetailsState {
  final Map<String, dynamic>? job;
  final bool isLoading;
  final String? error;

  JobDetailsState({
    this.job,
    this.isLoading = false,
    this.error,
  });

  JobDetailsState copyWith({
    Map<String, dynamic>? job,
    bool? isLoading,
    String? error,
  }) {
    return JobDetailsState(
      job: job ?? this.job,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class JobDetailsNotifier extends StateNotifier<JobDetailsState> {
  final JobRepository _repository;

  JobDetailsNotifier(this._repository) : super(JobDetailsState());

  Future<void> fetchJobDetails(String jobId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final job = await _repository.getJobDetails(jobId);
      state = state.copyWith(isLoading: false, job: job);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final jobDetailsProvider = StateNotifierProvider.family<JobDetailsNotifier, JobDetailsState, String>((ref, jobId) {
  final notifier = JobDetailsNotifier(ref.watch(jobRepositoryProvider));
  notifier.fetchJobDetails(jobId);
  return notifier;
});
