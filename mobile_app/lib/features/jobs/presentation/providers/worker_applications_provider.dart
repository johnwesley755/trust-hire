import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/application_repository.dart';
import '../../../../core/providers/api_provider.dart';

final applicationRepositoryProvider = Provider<ApplicationRepository>((ref) {
  return ApplicationRepository(ref.watch(apiClientProvider));
});

class WorkerApplicationsState {
  final List<dynamic> applications;
  final bool isLoading;
  final String? error;

  WorkerApplicationsState({
    this.applications = const [],
    this.isLoading = false,
    this.error,
  });

  WorkerApplicationsState copyWith({
    List<dynamic>? applications,
    bool? isLoading,
    String? error,
  }) {
    return WorkerApplicationsState(
      applications: applications ?? this.applications,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class WorkerApplicationsNotifier extends StateNotifier<WorkerApplicationsState> {
  final ApplicationRepository _repository;

  WorkerApplicationsNotifier(this._repository) : super(WorkerApplicationsState()) {
    fetchApplications();
  }

  Future<void> fetchApplications() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final list = await _repository.getMyApplications();
      state = state.copyWith(
        isLoading: false,
        applications: list,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final workerApplicationsProvider = StateNotifierProvider<WorkerApplicationsNotifier, WorkerApplicationsState>((ref) {
  return WorkerApplicationsNotifier(ref.watch(applicationRepositoryProvider));
});
