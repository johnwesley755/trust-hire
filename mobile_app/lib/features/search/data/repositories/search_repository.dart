import '../../../../core/api/api_client.dart';
import '../../../../core/api/endpoints.dart';

class SearchRepository {
  final ApiClient _api;

  SearchRepository(this._api);

  Future<List<dynamic>> searchWorkers({
    String? query, 
    String? skill,
    String? level,
    String? location,
    String? city,
  }) async {
    final response = await _api.dio.get(
      Endpoints.searchWorkers,
      queryParameters: {
        if (query != null && query.isNotEmpty) 'query': query,
        if (skill != null && skill.isNotEmpty) 'skill': skill,
        if (level != null && level.isNotEmpty) 'level': level,
        if (location != null && location.isNotEmpty) 'location': location,
        if (city != null && city.isNotEmpty) 'city': city,
      },
    );
    return response.data['data'];

  }
}
