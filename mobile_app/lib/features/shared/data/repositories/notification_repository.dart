import '../../../../core/api/api_client.dart';
import '../../../../core/api/endpoints.dart';

class NotificationRepository {
  final ApiClient _api;

  NotificationRepository(this._api);

  Future<List<dynamic>> getMyNotifications() async {
    final response = await _api.dio.get(Endpoints.notifications);
    return response.data;
  }

  Future<int> getUnreadCount() async {
    final response = await _api.dio.get('${Endpoints.notifications}/unread/count');
    return response.data;
  }

  Future<void> markAsRead(String id) async {
    await _api.dio.patch('${Endpoints.notifications}/$id/read');
  }

  Future<void> markAllAsRead() async {
    await _api.dio.patch('${Endpoints.notifications}/read-all');
  }

  Future<void> deleteNotification(String id) async {
    await _api.dio.delete('${Endpoints.notifications}/$id');
  }
}
