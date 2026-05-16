import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/search_repository.dart';
import '../../../../core/providers/api_provider.dart';

final searchRepositoryProvider = Provider<SearchRepository>((ref) {
  return SearchRepository(ref.watch(apiClientProvider));
});

class SearchState {
  final List<dynamic> workers;
  final bool isLoading;
  final String? error;

  SearchState({
    this.workers = const [],
    this.isLoading = false,
    this.error,
  });

  SearchState copyWith({
    List<dynamic>? workers,
    bool? isLoading,
    String? error,
  }) {
    return SearchState(
      workers: workers ?? this.workers,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class WorkerSearchNotifier extends StateNotifier<SearchState> {
  final SearchRepository _repository;

  WorkerSearchNotifier(this._repository) : super(SearchState()) {
    searchWorkers();
  }

  Future<void> searchWorkers({String? query, String? skill}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final workers = await _repository.searchWorkers(query: query, skill: skill);
      state = state.copyWith(
        isLoading: false,
        workers: workers,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final workerSearchProvider = StateNotifierProvider<WorkerSearchNotifier, SearchState>((ref) {
  return WorkerSearchNotifier(ref.watch(searchRepositoryProvider));
});
