import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import './personal_info_screen.dart';
import './company_details_screen.dart';
import './settings_detail_screen.dart';
import './identity_verification_screen.dart';
import '../../../help/presentation/screens/help_screen.dart';
import '../../../help/presentation/screens/guidelines_screen.dart';
import '../../../shared/presentation/widgets/trust_hire_header.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;
    final isWorker = authState.role == 'WORKER';
    final isVerified = user?['identity_verified'] ?? false;
    final name = (user != null && user['first_name'] != null) 
      ? '${user['first_name']} ${user['last_name'] ?? ''}' 
      : 'Hiring Professional';
    final String? imageUrl = user?['profile_image_url'] as String?;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const TrustHireHeader(),
          const SizedBox(height: 32),
          FadeInDown(
            child: Row(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(0xFFFACD15), width: 3),
                    boxShadow: [
                      BoxShadow(color: const Color(0xFFFACD15).withOpacity(0.2), blurRadius: 10, offset: const Offset(0, 4)),
                    ],
                    image: imageUrl != null ? DecorationImage(image: NetworkImage(imageUrl!), fit: BoxFit.cover) : null,
                  ),
                  child: imageUrl == null ? const Icon(LucideIcons.user, color: Color(0xFF1F3F34), size: 40) : null,
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF1F3F34),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: isVerified ? const Color(0xFFFACD15) : const Color(0xFFE9E8E3),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          isVerified 
                            ? (isWorker ? 'VERIFIED WORKER' : 'VERIFIED EMPLOYER')
                            : (isWorker ? 'UNVERIFIED WORKER' : 'UNVERIFIED EMPLOYER'),
                          style: TextStyle(
                            color: isVerified ? const Color(0xFF002117) : const Color(0xFF1F3F34).withOpacity(0.6),
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
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const PersonalInfoScreen())),
          ),
          _ProfileOption(
            icon: isWorker ? LucideIcons.shieldCheck : LucideIcons.building,
            label: isWorker ? 'Identity Verification' : 'Company Details',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => isWorker ? const IdentityVerificationScreen() : const CompanyDetailsScreen(),
              ),
            ),
          ),
          
          const SizedBox(height: 32),
          _buildSectionTitle('PREFERENCES'),
          const SizedBox(height: 16),
          _ProfileOption(
            icon: LucideIcons.bell,
            label: 'Notification Settings',
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const SettingsDetailScreen(title: 'Notification Settings'))),
          ),
          _ProfileOption(
            icon: LucideIcons.languages,
            label: 'Language Preferences',
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const SettingsDetailScreen(title: 'Language Preferences'))),
          ),
          
          const SizedBox(height: 32),
          _buildSectionTitle('SUPPORT'),
          const SizedBox(height: 16),
          _ProfileOption(
            icon: LucideIcons.helpCircle,
            label: 'Help & Support',
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const HelpScreen())),
          ),
          _ProfileOption(
            icon: LucideIcons.fileText,
            label: 'Guidelines',
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const GuidelinesScreen())),
          ),
          
          const SizedBox(height: 48),
          FadeInUp(
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => ref.read(authProvider.notifier).logout(),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFFba1a1a),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: const Color(0xFFba1a1a).withOpacity(0.2), width: 1.5),
                  ),
                  elevation: 0,
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(LucideIcons.logOut, size: 20),
                    SizedBox(width: 12),
                    Text('LOGOUT FROM TRUSTHIRE', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 0.5)),
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
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w900,
          letterSpacing: 1.5,
          color: const Color(0xFF1F3F34).withOpacity(0.5),
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
              border: Border.all(color: Colors.black.withOpacity(0.05)),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFACD15).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: const Color(0xFF1F3F34), size: 20),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    label,
                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: Color(0xFF1F3F34)),
                  ),
                ),
                Icon(LucideIcons.chevronRight, color: const Color(0xFF1F3F34).withOpacity(0.3), size: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
