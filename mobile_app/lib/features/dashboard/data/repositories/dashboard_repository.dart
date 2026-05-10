import '../../../../core/api/api_client.dart';
import '../../../../core/api/endpoints.dart';

class DashboardRepository {
  final ApiClient _api;

  DashboardRepository(this._api);

  Future<Map<String, dynamic>> getWorkerStats() async {
    final response = await _api.dio.get(Endpoints.workerStats);
    return response.data;
  }

  Future<Map<String, dynamic>> getEmployerStats() async {
    final response = await _api.dio.get(Endpoints.employerStats);
    return response.data;
  }
}
