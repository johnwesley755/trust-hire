import '../../../../core/api/api_client.dart';
import '../../../../core/api/endpoints.dart';

class JobRepository {
  final ApiClient _api;

  JobRepository(this._api);

  Future<List<dynamic>> getAllJobs() async {
    final response = await _api.dio.get(Endpoints.jobs);
    return response.data['data'] as List? ?? [];
  }

  Future<Map<String, dynamic>> getJobDetails(String id) async {
    final response = await _api.dio.get('${Endpoints.jobById}/$id');
    return response.data['data'];
  }

  Future<void> applyForJob(String jobId) async {
    await _api.dio.post(Endpoints.applyJob, data: {'jobId': jobId});
  }

  Future<List<dynamic>> getEmployerJobs() async {
    final response = await _api.dio.get(Endpoints.employerActiveJobs);
    return response.data['data'] as List? ?? [];
  }

  Future<Map<String, dynamic>> createJob(Map<String, dynamic> jobData) async {
    final response = await _api.dio.post(Endpoints.jobs, data: jobData);
    return response.data['data'];
  }

  Future<Map<String, dynamic>> getEmployerStats() async {
    final response = await _api.dio.get(Endpoints.employerDashboardStats);
    return response.data['data'] as Map<String, dynamic>? ?? {};
  }

  Future<Map<String, dynamic>> getWorkerStats() async {
    final response = await _api.dio.get(Endpoints.workerDashboardStats);
    return response.data['data'];
  }

  Future<List<dynamic>> getMyApplications() async {
    final response = await _api.dio.get(Endpoints.myApplications);
    return response.data['data'] as List? ?? [];
  }

  Future<List<dynamic>> searchJobs({String? query, String? city}) async {
    final response = await _api.dio.get(
      Endpoints.searchJobs,
      queryParameters: {
        if (query != null && query.isNotEmpty) 'query': query,
        if (city != null && city.isNotEmpty) 'city': city,
      },
    );
    return response.data['data'] as List? ?? [];
  }
}


