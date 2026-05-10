import '../../../../core/api/api_client.dart';
import '../../../../core/api/endpoints.dart';

class JobRepository {
  final ApiClient _api;

  JobRepository(this._api);

  Future<List<dynamic>> getAllJobs() async {
    final response = await _api.dio.get(Endpoints.jobDetails);
    return response.data;
  }

  Future<Map<String, dynamic>> getJobDetails(String id) async {
    final response = await _api.dio.get('${Endpoints.jobDetails}/$id');
    return response.data;
  }

  Future<void> applyForJob(String jobId) async {
    await _api.dio.post(Endpoints.applyJob, data: {'jobId': jobId});
  }

  Future<List<dynamic>> getEmployerJobs() async {
    final response = await _api.dio.get('${Endpoints.jobDetails}/employer');
    return response.data;
  }

  Future<Map<String, dynamic>> createJob(Map<String, dynamic> jobData) async {
    final response = await _api.dio.post(Endpoints.jobDetails, data: jobData);
    return response.data;
  }
}
