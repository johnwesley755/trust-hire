import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/notification_repository.dart';
import '../../../../core/providers/api_provider.dart';

final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  return NotificationRepository(ref.watch(apiClientProvider));
});

class NotificationState {
  final List<dynamic> notifications;
  final int unreadCount;
  final bool isLoading;

  NotificationState({
    this.notifications = const [],
    this.unreadCount = 0,
    this.isLoading = false,
  });

  NotificationState copyWith({
    List<dynamic>? notifications,
    int? unreadCount,
    bool? isLoading,
  }) {
    return NotificationState(
      notifications: notifications ?? this.notifications,
      unreadCount: unreadCount ?? this.unreadCount,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class NotificationNotifier extends StateNotifier<NotificationState> {
  final NotificationRepository _repository;

  NotificationNotifier(this._repository) : super(NotificationState()) {
    refreshNotifications();
  }

  Future<void> refreshNotifications() async {
    state = state.copyWith(isLoading: true);
    try {
      final notifications = await _repository.getNotifications();
      final unreadCount = await _repository.getUnreadCount();
      print('Notifications fetched: ${notifications.length}');
      state = state.copyWith(
        isLoading: false,
        notifications: notifications,
        unreadCount: unreadCount,
      );
    } catch (e) {
      print('Notifications error: $e');
      state = state.copyWith(isLoading: false);
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _repository.markAllAsRead();
      state = state.copyWith(unreadCount: 0);
      refreshNotifications();
    } catch (e) {
      // Handle error
    }
  }
}

final notificationProvider = StateNotifierProvider<NotificationNotifier, NotificationState>((ref) {
  return NotificationNotifier(ref.watch(notificationRepositoryProvider));
});
