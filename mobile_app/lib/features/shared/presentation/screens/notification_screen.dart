import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../providers/notification_provider.dart';

class NotificationScreen extends ConsumerWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notificationState = ref.watch(notificationProvider);
    final notifications = notificationState.notifications;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Notifications', style: TextStyle(fontWeight: FontWeight.w900)),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.checkCheck),
            onPressed: () => ref.read(notificationProvider.notifier).markAllAsRead(),
            tooltip: 'Mark all as read',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(notificationProvider.notifier).refreshNotifications(),
        child: notificationState.isLoading && notifications.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : notifications.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.bellOff, size: 64, color: AppColors.textTertiary.withOpacity(0.5)),
                        const SizedBox(height: 16),
                        const Text('No notifications yet', style: TextStyle(color: AppColors.textSecondary)),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: notifications.length,
                    itemBuilder: (context, index) {
                      final notification = notifications[index];
                      return FadeInUp(
                        delay: Duration(milliseconds: index * 50),
                        child: _NotificationItem(
                          title: notification['title'] ?? 'Notification',
                          message: notification['message'] ?? '',
                          isRead: notification['isRead'] ?? false,
                          time: notification['createdAt'] ?? '',
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}

class _NotificationItem extends StatelessWidget {
  final String title;
  final String message;
  final bool isRead;
  final String time;

  const _NotificationItem({
    required this.title,
    required this.message,
    required this.isRead,
    required this.time,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isRead ? Colors.white : AppColors.primary.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isRead ? AppColors.border : AppColors.primary.withOpacity(0.2)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isRead ? AppColors.background : AppColors.primary.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isRead ? LucideIcons.bell : LucideIcons.bellRing,
              size: 18,
              color: isRead ? AppColors.textTertiary : AppColors.primary,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(title, style: TextStyle(fontWeight: isRead ? FontWeight.bold : FontWeight.w900)),
                    if (!isRead)
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
                      ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  message,
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 13, height: 1.4),
                ),
                const SizedBox(height: 8),
                Text(
                  time, // You might want to format this
                  style: const TextStyle(color: AppColors.textTertiary, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
