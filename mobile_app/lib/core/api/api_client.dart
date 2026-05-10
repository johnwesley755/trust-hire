import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'endpoints.dart';

class ApiClient {
  late final Dio dio;
  final _storage = const FlutterSecureStorage();
  final VoidCallback? onSessionExpired;

  ApiClient({this.onSessionExpired}) {
    dio = Dio(BaseOptions(
      baseUrl: Endpoints.baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        if (e.response?.statusCode == 401 || e.response?.statusCode == 403) {
          // Check if it's NOT an auth endpoint to avoid looping/misleading modals during login
          final url = e.requestOptions.path;
          final isAuthEndpoint = url.contains(Endpoints.login) || 
                               url.contains(Endpoints.register);

          if (!isAuthEndpoint) {
            // Trigger global session expired event
            // In Flutter, we can use a StreamController or a shared state provider for this
            _handleSessionExpired();
          }
        }
        return handler.next(e);
      },
    ));
  }

  void _handleSessionExpired() {
    onSessionExpired?.call();
    print("SESSION EXPIRED: Redirecting to Login...");
  }
}
