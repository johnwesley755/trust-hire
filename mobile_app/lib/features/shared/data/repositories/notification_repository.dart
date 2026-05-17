import '../../../../core/api/api_client.dart';
import '../../../../core/api/endpoints.dart';

class NotificationRepository {
  final ApiClient _api;

  NotificationRepository(this._api);

  Future<List<dynamic>> getNotifications() async {
    final response = await _api.dio.get(Endpoints.notifications);
    return response.data['data'] as List? ?? [];
  }

  Future<int> getUnreadCount() async {
    final response = await _api.dio.get(Endpoints.unreadNotificationCount);
    return (response.data['data'] as num? ?? 0).toInt();
  }

  Future<void> markAllAsRead() async {
    await _api.dio.patch(Endpoints.markNotificationsRead);
  }
}
