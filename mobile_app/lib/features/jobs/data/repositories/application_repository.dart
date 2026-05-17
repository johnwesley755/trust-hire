import '../../../../core/api/api_client.dart';
import '../../../../core/api/endpoints.dart';

class ApplicationRepository {
  final ApiClient _api;

  ApplicationRepository(this._api);

  Future<List<dynamic>> getMyApplications() async {
    final response = await _api.dio.get('/api/jobs/applications/my');
    if (response.data is Map) {
      return response.data['data'] as List? ?? [];
    }
    return response.data as List? ?? [];
  }

  Future<List<dynamic>> getJobApplications(String jobId) async {
    final response = await _api.dio.get('/api/jobs/applications/job/$jobId');
    return response.data;
  }

  Future<Map<String, dynamic>> updateStatus(String applicationId, String status) async {
    final response = await _api.dio.patch(
      '/api/jobs/applications/$applicationId/status',
      queryParameters: {'status': status},
    );
    return response.data;
  }

  Future<Map<String, dynamic>> apply(String jobId, String? coverLetter) async {
    final response = await _api.dio.post(
      '/api/jobs/applications',
      data: {
        'jobId': jobId,
        'coverLetter': coverLetter,
      },
    );
    return response.data;
  }
}
