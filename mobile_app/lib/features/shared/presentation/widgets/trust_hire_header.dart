import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../screens/notification_screen.dart';
import '../providers/notification_provider.dart';

class TrustHireHeader extends ConsumerWidget {
  const TrustHireHeader({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final notificationState = ref.watch(notificationProvider);
    
    final profileImageUrl = auth.user?['profile_image_url'] as String?;
    final unreadNotifications = notificationState.unreadCount.toString();

    return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            'TrustHire',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: Color(0xFF1B3F34),
              letterSpacing: -0.5,
            ),
          ),
          Row(
            children: [
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const NotificationScreen(),
                    ),
                  );
                },
                child: Badge(
                  label: Text(unreadNotifications),
                  child: const Icon(LucideIcons.bell, color: Color(0xFF1B3F34), size: 24),
                ),
              ),
              const SizedBox(width: 16),
              Container(
                width: 32,
                height: 32,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0xFFFACD15),
                ),
                clipBehavior: Clip.antiAlias,
                child: profileImageUrl != null && profileImageUrl.isNotEmpty
                    ? Image.network(
                        profileImageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => const Icon(LucideIcons.user, size: 20, color: Color(0xFF002117)),
                      )
                    : const Icon(LucideIcons.user, size: 20, color: Color(0xFF002117)),
              ),
            ],
          ),
      ],
    );
  }
}
