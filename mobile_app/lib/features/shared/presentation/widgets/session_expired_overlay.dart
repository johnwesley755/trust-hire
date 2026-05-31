import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../../core/providers/api_provider.dart';

class SessionExpiredOverlay extends ConsumerWidget {
  const SessionExpiredOverlay({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isExpired = ref.watch(sessionExpiredProvider);

    if (!isExpired) return const SizedBox.shrink();

    return Material(
      color: Colors.transparent,
      child: Stack(
        children: [
          // Blurred backdrop
          Container(
            color: AppColors.primary.withOpacity(0.6),
          ),
          
          Center(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(40),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 30,
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: AppColors.accent.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(32),
                      ),
                      child: const Stack(
                        alignment: Alignment.center,
                        children: [
                          Icon(LucideIcons.shieldAlert, color: AppColors.accent, size: 40),
                          Positioned(
                            bottom: 15,
                            right: 15,
                            child: Icon(LucideIcons.clock, color: AppColors.primary, size: 18),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Session Timeout',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Your secure session has expired.\nPlease sign in again to continue.',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 32),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: AppColors.accent,
                        ),
                        onPressed: () {
                          // Reset expiry state and logout
                          ref.read(sessionExpiredProvider.notifier).state = false;
                          ref.read(authProvider.notifier).logout();
                        },
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(LucideIcons.logOut, size: 16),
                            SizedBox(width: 8),
                            Text('RETURN TO LOGIN'),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
