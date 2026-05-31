import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../providers/worker_applications_provider.dart';

class ApplicationsScreen extends ConsumerStatefulWidget {
  const ApplicationsScreen({super.key});

  @override
  ConsumerState<ApplicationsScreen> createState() => _ApplicationsScreenState();
}

class _ApplicationsScreenState extends ConsumerState<ApplicationsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(workerApplicationsProvider.notifier).fetchApplications();
    });
  }

  @override
  Widget build(BuildContext context) {
    final applicationsState = ref.watch(workerApplicationsProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.fromLTRB(24, 20, 24, 24),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'My Applications',
                style: Theme.of(context).textTheme.displaySmall,
              ),
              const SizedBox(height: 8),
              Text(
                'Track the status of your active job applications.',
                style: TextStyle(color: AppColors.textSecondary),
              ),
            ],
          ),
        ),
        
        Expanded(
          child: RefreshIndicator(
            onRefresh: () => ref.read(workerApplicationsProvider.notifier).fetchApplications(),
            child: applicationsState.isLoading
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24.0),
                      child: CircularProgressIndicator(),
                    ),
                  )
                : applicationsState.applications.isEmpty
                    ? ListView(
                        children: const [
                          Padding(
                            padding: EdgeInsets.all(48.0),
                            child: Center(
                              child: Text(
                                'You haven\'t applied to any jobs yet.',
                                textAlign: TextAlign.center,
                                style: TextStyle(color: AppColors.textSecondary),
                              ),
                            ),
                          ),
                        ],
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(24),
                        itemCount: applicationsState.applications.length,
                        itemBuilder: (context, index) {
                          final app = applicationsState.applications[index];
                          final job = app['job'] as Map<String, dynamic>? ?? {};
                          final jobTitle = job['title'] ?? 'Job Opportunity';
                          final company = job['employerName'] ?? job['industry'] ?? 'Registered Partner';
                          final status = app['status'] ?? 'PENDING';
                          
                          final dateStr = app['appliedAt'] != null 
                              ? 'Applied ${_formatDate(app['appliedAt'])}' 
                              : 'Applied recently';

                          return _ApplicationCard(
                            jobTitle: jobTitle,
                            company: company,
                            status: status,
                            date: dateStr,
                            delay: index * 100,
                          );
                        },
                      ),
          ),
        ),
      ],
    );
  }

  String _formatDate(String dateString) {
    try {
      final dateTime = DateTime.parse(dateString);
      final difference = DateTime.now().difference(dateTime);
      if (difference.inDays > 7) {
        return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
      } else if (difference.inDays >= 1) {
        return '${difference.inDays} days ago';
      } else if (difference.inHours >= 1) {
        return '${difference.inHours}h ago';
      } else {
        return 'recently';
      }
    } catch (_) {
      return 'recently';
    }
  }
}

class _ApplicationCard extends StatelessWidget {
  final String jobTitle;
  final String company;
  final String status;
  final String date;
  final int delay;

  const _ApplicationCard({
    required this.jobTitle,
    required this.company,
    required this.status,
    required this.date,
    required this.delay,
  });

  Color _getStatusColor() {
    switch (status) {
      case 'PENDING': return Colors.orange;
      case 'REVIEWING': return AppColors.primary;
      case 'ACCEPTED': return AppColors.success;
      case 'REJECTED': return AppColors.error;
      default: return AppColors.textTertiary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return FadeInUp(
      delay: Duration(milliseconds: delay),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: _getStatusColor().withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(LucideIcons.briefcase, color: _getStatusColor(), size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    jobTitle,
                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15),
                  ),
                  Text(
                    company,
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    date,
                    style: const TextStyle(color: AppColors.textTertiary, fontSize: 10),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: _getStatusColor().withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                status,
                style: TextStyle(
                  color: _getStatusColor(),
                  fontSize: 8,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

