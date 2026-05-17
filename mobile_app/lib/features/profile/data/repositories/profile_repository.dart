import '../../../../core/api/api_client.dart';
import '../../../../core/api/endpoints.dart';

class ProfileRepository {
  final ApiClient _api;

  ProfileRepository(this._api);

  // Worker Profile
  Future<Map<String, dynamic>> getWorkerProfile() async {
    final response = await _api.dio.get('/api/worker/profile');
    return response.data;
  }

  Future<Map<String, dynamic>> updateWorkerProfile(Map<String, dynamic> data) async {
    final response = await _api.dio.put('/api/worker/profile', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> getTrustScore(String userId) async {
    final response = await _api.dio.get('/api/worker/trust-score/$userId');
    return response.data;
  }

  // Employer Profile
  Future<Map<String, dynamic>> getEmployerProfile() async {
    final response = await _api.dio.get('/api/employer/profile');
    return response.data;
  }

  Future<Map<String, dynamic>> updateEmployerProfile(Map<String, dynamic> data) async {
    final response = await _api.dio.put('/api/employer/profile', data: data);
    return response.data;
  }
}
