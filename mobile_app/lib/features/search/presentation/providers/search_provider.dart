import 'dart:async';
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
  
  // Filter States
  final String query;
  final String city;
  final String level;
  final String skill;

  SearchState({
    this.workers = const [],
    this.isLoading = false,
    this.error,
    this.query = '',
    this.city = '',
    this.level = '',
    this.skill = '',
  });

  SearchState copyWith({
    List<dynamic>? workers,
    bool? isLoading,
    String? error,
    String? query,
    String? city,
    String? level,
    String? skill,
  }) {
    return SearchState(
      workers: workers ?? this.workers,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      query: query ?? this.query,
      city: city ?? this.city,
      level: level ?? this.level,
      skill: skill ?? this.skill,
    );
  }
}

class WorkerSearchNotifier extends StateNotifier<SearchState> {
  final SearchRepository _repository;
  Timer? _debounce;

  WorkerSearchNotifier(this._repository) : super(SearchState()) {
    searchWorkers();
  }

  @override
  void dispose() {
    _debounce?.cancel();
    super.dispose();
  }

  void updateFilters({String? query, String? city, String? level, String? skill}) {
    state = state.copyWith(
      query: query,
      city: city,
      level: level,
      skill: skill,
    );
    _debouncedSearch();
  }
  
  void clearFilters() {
    state = state.copyWith(query: '', city: '', level: '', skill: '');
    searchWorkers();
  }

  void _debouncedSearch() {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      searchWorkers();
    });
  }

  Future<void> searchWorkers() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final workers = await _repository.searchWorkers(
        query: state.query, 
        skill: state.skill,
        city: state.city,
        level: state.level,
      );
      if (mounted) {
        state = state.copyWith(
          isLoading: false,
          workers: workers,
        );
      }
    } catch (e) {
      if (mounted) state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final workerSearchProvider = StateNotifierProvider<WorkerSearchNotifier, SearchState>((ref) {
  return WorkerSearchNotifier(ref.watch(searchRepositoryProvider));
});
