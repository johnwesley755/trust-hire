import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import 'sign_in_screen.dart';

class RoleSelectionScreen extends StatelessWidget {
  const RoleSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background blobs (Mirroring React organic blobs)
          Positioned(
            top: -100,
            right: -100,
            child: FadeInDown(
              duration: const Duration(seconds: 2),
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  color: AppColors.accent.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),
          
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 40),
                  FadeInLeft(
                    child: Text(
                      'Welcome to\nTrustHire.',
                      style: Theme.of(context).textTheme.displayLarge,
                    ),
                  ),
                  const SizedBox(height: 16),
                  FadeInLeft(
                    delay: const Duration(milliseconds: 200),
                    child: Text(
                      'How do you want to use\nthe platform today?',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                  const Spacer(),
                  
                  // Role Cards
                  _RoleCard(
                    title: 'I want to Work',
                    subtitle: 'Find verified jobs and build your professional profile.',
                    icon: LucideIcons.briefcase,
                    delay: 400,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SignInScreen(role: 'WORKER')),
                      );
                    },
                  ),
                  const SizedBox(height: 20),
                  _RoleCard(
                    title: 'I want to Hire',
                    subtitle: 'Post jobs and connect with trusted talent across Bharat.',
                    icon: LucideIcons.users,
                    delay: 600,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SignInScreen(role: 'EMPLOYER')),
                      );
                    },
                  ),
                  
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final int delay;
  final VoidCallback onTap;

  const _RoleCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.delay,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return FadeInUp(
      delay: Duration(milliseconds: delay),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(32),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withOpacity(0.05),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: AppColors.accent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, color: AppColors.primary),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(LucideIcons.chevronRight, color: AppColors.textTertiary),
            ],
          ),
        ),
      ),
    );
  }
}
