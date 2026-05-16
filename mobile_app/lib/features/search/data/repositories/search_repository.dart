import '../../../../core/api/api_client.dart';
import '../../../../core/api/endpoints.dart';

class SearchRepository {
  final ApiClient _api;

  SearchRepository(this._api);

  Future<List<dynamic>> searchWorkers({String? query, String? skill}) async {
    final response = await _api.dio.get(
      Endpoints.searchWorkers,
      queryParameters: {
        if (query != null) 'query': query,
        if (skill != null) 'skill': skill,
      },
    );
    return response.data['data'];
  }
}
