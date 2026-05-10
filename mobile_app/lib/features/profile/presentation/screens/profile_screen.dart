import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final role = ref.watch(authProvider).role;
    final isWorker = role == 'WORKER';

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 20),
          FadeInDown(
            child: Row(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppColors.accent.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: AppColors.accent.withOpacity(0.5), width: 2),
                  ),
                  child: const Icon(LucideIcons.user, color: AppColors.primary, size: 40),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Habib Mohammed',
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          isWorker ? 'VERIFIED WORKER' : 'VERIFIED EMPLOYER',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 40),
          _buildSectionTitle('ACCOUNT OVERVIEW'),
          const SizedBox(height: 16),
          _ProfileOption(
            icon: LucideIcons.userCircle,
            label: 'Personal Information',
            onTap: () {},
          ),
          _ProfileOption(
            icon: isWorker ? LucideIcons.shieldCheck : LucideIcons.building,
            label: isWorker ? 'Identity Verification' : 'Company Details',
            onTap: () {},
          ),
          _ProfileOption(
            icon: LucideIcons.lock,
            label: 'Security & Password',
            onTap: () {},
          ),
          
          const SizedBox(height: 32),
          _buildSectionTitle('PREFERENCES'),
          const SizedBox(height: 16),
          _ProfileOption(
            icon: LucideIcons.bell,
            label: 'Notification Settings',
            onTap: () {},
          ),
          _ProfileOption(
            icon: LucideIcons.languages,
            label: 'Language Preferences',
            onTap: () {},
          ),
          
          const SizedBox(height: 32),
          _buildSectionTitle('SUPPORT'),
          const SizedBox(height: 16),
          _ProfileOption(
            icon: LucideIcons.helpCircle,
            label: 'Help Center',
            onTap: () {},
          ),
          _ProfileOption(
            icon: LucideIcons.fileText,
            label: 'Terms & Privacy Policy',
            onTap: () {},
          ),
          
          const SizedBox(height: 48),
          FadeInUp(
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => ref.read(authProvider.notifier).logout(),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.background,
                  foregroundColor: AppColors.error,
                  elevation: 0,
                  side: const BorderSide(color: AppColors.error, width: 1.5),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(LucideIcons.logOut, size: 20),
                    SizedBox(width: 12),
                    Text('LOGOUT FROM TRUSTHIRE'),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return FadeInLeft(
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.5,
          color: AppColors.textTertiary,
        ),
      ),
    );
  }
}

class _ProfileOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ProfileOption({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return FadeInUp(
      child: Padding(
        padding: const EdgeInsets.only(bottom: 8.0),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                Icon(icon, color: AppColors.primary, size: 22),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    label,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                  ),
                ),
                const Icon(LucideIcons.chevronRight, color: AppColors.textTertiary, size: 18),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
