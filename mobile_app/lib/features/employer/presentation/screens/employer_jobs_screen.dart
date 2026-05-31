import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:animate_do/animate_do.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../dashboard/presentation/providers/dashboard_provider.dart';
import '../screens/employer_applications_screen.dart';

class EmployerJobsScreen extends ConsumerStatefulWidget {
  const EmployerJobsScreen({super.key});

  @override
  ConsumerState<EmployerJobsScreen> createState() => _EmployerJobsScreenState();
}

class _EmployerJobsScreenState extends ConsumerState<EmployerJobsScreen> {
  @override
  Widget build(BuildContext context) {
    final dashboardState = ref.watch(dashboardProvider);
    final jobs = dashboardState.activeJobs;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Job Posts', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.refreshCw, size: 20),
            onPressed: () => ref.read(dashboardProvider.notifier).refreshDashboard(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(dashboardProvider.notifier).refreshDashboard(),
        child: dashboardState.isLoading && jobs.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : jobs.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.all(24),
                    itemCount: jobs.length,
                    itemBuilder: (context, index) {
                      final job = jobs[index];
                      return _JobCard(job: job, index: index);
                    },
                  ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.briefcase, size: 64, color: AppColors.textTertiary.withOpacity(0.5)),
          const SizedBox(height: 16),
          const Text('You haven\'t posted any jobs yet.', style: TextStyle(color: AppColors.textSecondary)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              // Navigate to post job (handled by tab controller usually)
            },
            child: const Text('POST YOUR FIRST JOB'),
          ),
        ],
      ),
    );
  }
}

class _JobCard extends StatelessWidget {
  final dynamic job;
  final int index;

  const _JobCard({required this.job, required this.index});

  @override
  Widget build(BuildContext context) {
    final title = job['title'] ?? 'Untitled Job';
    final location = job['location'] ?? 'Remote';
    final salary = job['salary'] ?? 'Not specified';
    final status = job['status'] ?? 'OPEN';

    return FadeInUp(
      delay: Duration(milliseconds: index * 50),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: status == 'OPEN' ? AppColors.success.withOpacity(0.1) : Colors.grey.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    status,
                    style: TextStyle(
                      color: status == 'OPEN' ? AppColors.success : Colors.grey,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const Icon(LucideIcons.moreVertical, size: 18, color: AppColors.textTertiary),
              ],
            ),
            const SizedBox(height: 12),
            Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(LucideIcons.mapPin, size: 14, color: AppColors.textSecondary),
                const SizedBox(width: 4),
                Text(location, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                const SizedBox(width: 16),
                const Icon(LucideIcons.banknote, size: 14, color: AppColors.textSecondary),
                const SizedBox(width: 4),
                Text(salary, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const EmployerApplicationsScreen()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('VIEW APPLICATIONS'),
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
