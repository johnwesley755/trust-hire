import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../dashboard/presentation/providers/dashboard_provider.dart';
import '../../../shared/presentation/providers/notification_provider.dart';
import '../../../shared/presentation/screens/notification_screen.dart';
import './employer_applications_screen.dart';
import './employer_jobs_screen.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class EmployerDashboardScreen extends ConsumerWidget {
  const EmployerDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dashboardState = ref.watch(dashboardProvider);
    final notificationState = ref.watch(notificationProvider);
    final authState = ref.watch(authProvider);
    final stats = dashboardState.stats;
    final activeJobs = dashboardState.activeJobs;
    final firstName = authState.user?['first_name'] ?? 'Hiring Team';

    return RefreshIndicator(
      onRefresh: () async {
        await ref.read(dashboardProvider.notifier).refreshDashboard();
        await ref.read(notificationProvider.notifier).refreshNotifications();
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            FadeInDown(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'TrustHire',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          color: AppColors.primary,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Hello, $firstName!',
                        style: Theme.of(context).textTheme.displayMedium,
                      ),
                    ],
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => NotificationScreen()),
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Badge(
                        label: Text(notificationState.unreadCount.toString()),
                        child: const Icon(LucideIcons.bell, color: AppColors.primary),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            
            if (dashboardState.isLoading && stats.isEmpty)
              const Center(child: CircularProgressIndicator())
            else ...[
              SizedBox(
                height: 140,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    _StatCard(
                      label: 'ACTIVE JOBS',
                      value: stats['activeJobs']?.toString() ?? '0',
                      icon: LucideIcons.briefcase,
                      color: AppColors.primary,
                      delay: 100,
                    ),
                    const SizedBox(width: 16),
                    _StatCard(
                      label: 'TOTAL APPLICANTS',
                      value: stats['totalApplicants']?.toString() ?? '0',
                      icon: LucideIcons.users,
                      color: AppColors.accent,
                      delay: 200,
                    ),
                    const SizedBox(width: 16),
                    _StatCard(
                      label: 'INTERVIEWING',
                      value: stats['interviewingCount']?.toString() ?? '0',
                      icon: LucideIcons.calendarCheck,
                      color: AppColors.success,
                      delay: 300,
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 32),
              
              FadeInUp(
                delay: const Duration(milliseconds: 400),
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(32),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    children: [
                      _DashboardActionCard(
                        title: 'My Jobs',
                        subtitle: 'View and edit your posts',
                        icon: LucideIcons.briefcase,
                        color: Colors.blue,
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const EmployerJobsScreen())),
                      ),
                      const SizedBox(height: 16),
                      _DashboardActionCard(
                        title: 'Manage Applications',
                        subtitle: 'Review and hire talent',
                        icon: LucideIcons.users,
                        color: AppColors.primary,
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const EmployerApplicationsScreen())),
                      ),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: 32),
              FadeInUp(
                delay: const Duration(milliseconds: 500),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Active Job Postings',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    Text(
                      '${activeJobs.length} TOTAL',
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textTertiary),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              if (activeJobs.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 40),
                  child: Center(
                    child: Text('No active jobs yet.', style: TextStyle(color: AppColors.textSecondary)),
                  ),
                )
              else
                ...activeJobs.map((job) => _JobItem(
                  title: job['title'] ?? 'Untitled Job',
                  applicants: job['applicationsCount'] ?? 0,
                  location: job['location'] ?? 'Remote',
                  delay: 600,
                )).toList(),
            ],
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  final int delay;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
    required this.delay,
  });

  @override
  Widget build(BuildContext context) {
    return FadeInRight(
      delay: Duration(milliseconds: delay),
      child: Container(
        width: 140,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Icon(icon, color: color, size: 20),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.w900,
                  ),
                ),
                Text(
                  label,
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    fontSize: 8,
                    letterSpacing: 1,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _JobItem extends StatelessWidget {
  final String title;
  final int applicants;
  final String location;
  final int delay;

  const _JobItem({
    required this.title,
    required this.applicants,
    required this.location,
    required this.delay,
  });

  @override
  Widget build(BuildContext context) {
    return FadeInUp(
      delay: Duration(milliseconds: delay),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.5),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            const CircleAvatar(
              backgroundColor: AppColors.background,
              child: Icon(LucideIcons.briefcase, color: AppColors.primary, size: 16),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
                  Text(location, style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.accent.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '$applicants APPS',
                style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 10),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DashboardActionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _DashboardActionCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: color.withOpacity(0.05),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: color.withOpacity(0.1)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Text(subtitle, style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                ],
              ),
            ),
            const Icon(LucideIcons.chevronRight, color: AppColors.textTertiary, size: 20),
          ],
        ),
      ),
    );
  }
}
