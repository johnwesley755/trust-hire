import 'dart:convert';
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
  final bool onboarded;
  final Map<String, dynamic>? user;

  AuthState({
    this.isLoading = true,
    this.error,
    this.isAuthenticated = false,
    this.role,
    this.onboarded = false,
    this.user,
  });

  AuthState copyWith({
    bool? isLoading,
    String? error,
    bool? isAuthenticated,
    String? role,
    bool? onboarded,
    Map<String, dynamic>? user,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      role: role ?? this.role,
      onboarded: onboarded ?? this.onboarded,
      user: user ?? this.user,
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
    final onboardedStr = await _storage.read(key: 'onboarded');
    final userJson = await _storage.read(key: 'user');
    
    Map<String, dynamic>? user;
    if (userJson != null) {
      try {
        user = jsonDecode(userJson);
      } catch (_) {}
    }

    if (token != null) {
      state = state.copyWith(
        isAuthenticated: true, 
        role: role,
        onboarded: onboardedStr == 'true',
        user: user,
      );
      // Fetch fresh user data on startup
      await _fetchCurrentUser();
    }
    state = state.copyWith(isLoading: false);
  }

  Future<void> _fetchCurrentUser() async {
    try {
      final responseBody = await _repository.getCurrentUser();
      final userData = responseBody['data'];
      state = state.copyWith(user: userData);
    } catch (e) {
      print('Error fetching current user: $e');
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final responseBody = await _repository.login(email, password);
      final responseData = responseBody['data'];
      final token = responseData['token'];
      final userData = responseData['user'];
      final role = userData['role'];
      final onboarded = userData['onboarded'] ?? false;

      await _storage.write(key: 'token', value: token);
      await _storage.write(key: 'role', value: role);
      await _storage.write(key: 'onboarded', value: onboarded.toString());
      await _storage.write(key: 'user', value: jsonEncode(userData));

      state = state.copyWith(
        isLoading: false,
        isAuthenticated: true,
        role: role,
        onboarded: onboarded,
        user: userData,
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
      final responseBody = await _repository.register(data);
      print('Registration Response: $responseBody');
      
      if (responseBody['data'] == null) {
        throw 'Invalid response from server: Missing data';
      }

      final responseData = responseBody['data'] as Map<String, dynamic>;
      final token = responseData['token'] as String?;
      final userData = responseData['user'] as Map<String, dynamic>?;

      if (token == null || userData == null) {
        throw 'Invalid response from server: Missing token or user data';
      }

      final role = userData['role'] as String?;
      final onboarded = userData['onboarded'] as bool? ?? false;

      await _storage.write(key: 'token', value: token);
      if (role != null) {
        await _storage.write(key: 'role', value: role);
      }
      await _storage.write(key: 'onboarded', value: onboarded.toString());

      state = state.copyWith(
        isLoading: false,
        isAuthenticated: true,
        role: role,
        onboarded: onboarded,
        user: userData,
      );
      return true;
    } catch (e) {
      print('Registration Error: $e');
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  Future<void> sync(String role) async {
    try {
      final responseBody = await _repository.sync(role);
      final responseData = responseBody['data'];
      
      // The sync endpoint returns the UserMetadata object directly in 'data'
      final onboarded = responseData['onboarded'] ?? false;

      await _storage.write(key: 'onboarded', value: onboarded.toString());
      await _storage.write(key: 'user', value: jsonEncode(responseData));
      state = state.copyWith(
        onboarded: onboarded,
        user: responseData,
      );
    } catch (e) {
      print('Sync Error: $e');
    }
  }

  Future<void> logout() async {
    await _storage.deleteAll();
    state = AuthState(isLoading: false);
  }

  Future<bool> forgotPassword(String email, String role) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.forgotPassword(email, role);
      state = state.copyWith(isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  Future<bool> resetPassword(String token, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.resetPassword(token, password);
      state = state.copyWith(isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }
}

// Providers
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(apiClientProvider));
});

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.watch(authRepositoryProvider));
});
