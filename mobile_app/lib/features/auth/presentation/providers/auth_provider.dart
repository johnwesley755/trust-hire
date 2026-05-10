import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../data/repositories/auth_repository.dart';
import '../../../../core/providers/api_provider.dart';

// Auth State Class
class AuthState {
  final bool isLoading;
  final String? error;
  final bool isAuthenticated;
  final String? role;

  AuthState({
    this.isLoading = false,
    this.error,
    this.isAuthenticated = false,
    this.role,
  });

  AuthState copyWith({
    bool? isLoading,
    String? error,
    bool? isAuthenticated,
    String? role,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      role: role ?? this.role,
    );
  }
}

// Auth Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;
  final _storage = const FlutterSecureStorage();

  AuthNotifier(this._repository) : super(AuthState()) {
    _checkInitialAuth();
  }

  Future<void> _checkInitialAuth() async {
    final token = await _storage.read(key: 'token');
    final role = await _storage.read(key: 'role');
    if (token != null) {
      state = state.copyWith(isAuthenticated: true, role: role);
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _repository.login(email, password);
      final token = response['token'];
      final userData = response['user'];
      final role = userData['role'];

      await _storage.write(key: 'token', value: token);
      await _storage.write(key: 'role', value: role);

      state = state.copyWith(
        isLoading: false,
        isAuthenticated: true,
        role: role,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  Future<bool> sendOtp(String email) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.sendOtp(email);
      state = state.copyWith(isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  Future<bool> register(Map<String, dynamic> data) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _repository.register(data);
      final token = response['token'];
      final userData = response['user'];
      final role = userData['role'];

      await _storage.write(key: 'token', value: token);
      await _storage.write(key: 'role', value: role);

      state = state.copyWith(
        isLoading: false,
        isAuthenticated: true,
        role: role,
      );
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  Future<void> logout() async {
    await _storage.deleteAll();
    state = AuthState();
  }
}

// Providers
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(apiClientProvider));
});

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.watch(authRepositoryProvider));
});
