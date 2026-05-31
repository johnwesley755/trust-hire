import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../providers/worker_applications_provider.dart';
import './job_details_screen.dart';
import '../../../shared/presentation/widgets/trust_hire_header.dart';

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
        const Padding(
          padding: EdgeInsets.fromLTRB(24, 20, 24, 8),
          child: TrustHireHeader(),
        ),
        Container(
          padding: const EdgeInsets.fromLTRB(24, 20, 24, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'My Applications',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF1F3F34),
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Track the status of your active job applications.',
                style: TextStyle(color: const Color(0xFF1F3F34).withOpacity(0.6), fontWeight: FontWeight.bold),
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
                          final jobId = job['id'] as String?;
                          
                          final dateStr = app['appliedAt'] != null 
                              ? 'Applied ${_formatDate(app['appliedAt'])}' 
                              : 'Applied recently';

                          return _ApplicationCard(
                            jobId: jobId,
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
  final String? jobId;
  final String jobTitle;
  final String company;
  final String status;
  final String date;
  final int delay;

  const _ApplicationCard({
    this.jobId,
    required this.jobTitle,
    required this.company,
    required this.status,
    required this.date,
    required this.delay,
  });

  @override
  Widget build(BuildContext context) {
    final isAccepted = status.toUpperCase() == 'ACCEPTED';

    return FadeInUp(
      delay: Duration(milliseconds: delay),
      child: GestureDetector(
        onTap: () {
          if (jobId != null) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => JobDetailsScreen(jobId: jobId!)),
            );
          }
        },
        child: Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border(
              left: BorderSide(
                color: isAccepted ? const Color(0xFFFACD15) : Colors.transparent,
                width: 4,
              ),
            ),
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: isAccepted ? const Color(0xFFFACD15) : const Color(0xFFE9E8E3),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            status.toUpperCase(),
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: isAccepted ? const Color(0xFF002117) : const Color(0xFF1F3F34).withOpacity(0.6),
                              letterSpacing: 1,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text('• $date', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF1F3F34).withOpacity(0.4))),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      jobTitle,
                      style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Color(0xFF1F3F34)),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      company,
                      style: TextStyle(color: const Color(0xFF1F3F34).withOpacity(0.6), fontSize: 12, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ),
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFFE9E8E3),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(
                  isAccepted ? LucideIcons.hammer : LucideIcons.shield,
                  color: const Color(0xFF1F3F34),
                  size: 24,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

