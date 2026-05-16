import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'endpoints.dart';

class ApiClient {
  final Dio dio = Dio();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final Function? onSessionExpired;

  ApiClient({this.onSessionExpired}) {
    // Force the baseUrl to be absolute
    dio.options.baseUrl = Endpoints.baseUrl;
    dio.options.connectTimeout = const Duration(seconds: 10);
    dio.options.receiveTimeout = const Duration(seconds: 10);

    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        
        // Ensure Content-Type is set for POST/PUT/PATCH to avoid octet-stream on Web
        if (options.method != 'GET' && options.data != null) {
          options.headers['Content-Type'] = 'application/json';
        }
        
        // Ensure the URL is absolute if it's not already
        if (!options.path.startsWith('http')) {
          options.path = '${Endpoints.baseUrl}${options.path.startsWith('/') ? '' : '/'}${options.path}';
        }
        
        print('API REQUEST: [${options.method}] ${options.path}');
        return handler.next(options);
      },
      onResponse: (response, handler) {
        print('API RESPONSE: [${response.statusCode}] ${response.requestOptions.path}');
        return handler.next(response);
      },
      onError: (DioException e, handler) {
        print('API ERROR: [${e.response?.statusCode}] ${e.requestOptions.path} -> ${e.message}');
        if (e.response?.statusCode == 401 || e.response?.statusCode == 403) {
          final url = e.requestOptions.path;
          final isAuthEndpoint = url.contains(Endpoints.login) || 
                                url.contains(Endpoints.register);

          if (!isAuthEndpoint) {
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

  String resolveMediaUrl(String? path) {
    if (path == null || path.isEmpty) return '';
    if (path.startsWith('http')) return path;
    final cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return '${Endpoints.baseUrl}/$cleanPath';
  }
}
