import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:animate_do/animate_do.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/providers/api_provider.dart';
import '../../../profile/presentation/screens/worker_profile_screen.dart';

class EmployerApplicationsScreen extends ConsumerStatefulWidget {
  const EmployerApplicationsScreen({super.key});

  @override
  ConsumerState<EmployerApplicationsScreen> createState() => _EmployerApplicationsScreenState();
}

class _EmployerApplicationsScreenState extends ConsumerState<EmployerApplicationsScreen> {
  bool _isLoading = true;
  List<dynamic> _applications = [];

  @override
  void initState() {
    super.initState();
    _fetchApplications();
  }

  Future<void> _fetchApplications() async {
    try {
      if (mounted) setState(() => _isLoading = true);
      // 1. Get employer jobs
      final jobsResponse = await ref.read(apiClientProvider).dio.get('/api/jobs/employer');
      final List<dynamic> jobs = jobsResponse.data['data'] ?? [];
      
      if (jobs.isEmpty) {
        if (mounted) setState(() { _applications = []; _isLoading = false; });
        return;
      }

      // 2. Get applications for those jobs
      final List<String> jobIds = jobs.map((j) => j['id'] as String).toList();
      final appResponse = await ref.read(apiClientProvider).dio.post('/api/jobs/applications/by-jobs', data: jobIds);
      final List<dynamic> applications = appResponse.data['data'] ?? [];

      if (applications.isEmpty) {
        if (mounted) setState(() { _applications = []; _isLoading = false; });
        return;
      }

      // 3. Fetch worker profiles
      final List<String> workerIds = applications.map((a) => a['workerId'] as String).toSet().toList();
      final workerResponse = await ref.read(apiClientProvider).dio.post('/api/worker/profiles/by-user-ids', data: workerIds);
      final List<dynamic> workers = workerResponse.data['data'] ?? [];
      
      final Map<String, dynamic> workerMap = {
        for (var w in workers) w['userId']: w
      };

      final enrichedApplications = applications.map((app) {
        return {
          ...app,
          'worker': workerMap[app['workerId']],
        };
      }).toList();
      
      if (mounted) {
        setState(() {
          _applications = enrichedApplications;
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error fetching applications: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Job Applications', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: _fetchApplications,
        child: _isLoading && _applications.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : _applications.isEmpty 
            ? _buildEmptyState()
            : ListView.builder(
                padding: const EdgeInsets.all(24),
                itemCount: _applications.length,
                itemBuilder: (context, index) {
                  return _ApplicationCard(
                    application: _applications[index], 
                    index: index,
                    onStatusUpdated: _fetchApplications,
                  );
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
          Icon(LucideIcons.fileX, size: 64, color: AppColors.textTertiary.withOpacity(0.5)),
          const SizedBox(height: 16),
          const Text('No applications received yet.', style: TextStyle(color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}

class _ApplicationCard extends ConsumerWidget {
  final dynamic application;
  final int index;
  final VoidCallback onStatusUpdated;

  const _ApplicationCard({
    required this.application, 
    required this.index,
    required this.onStatusUpdated,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final status = application['status'] ?? 'PENDING';
    final jobTitle = application['job']?['title'] ?? 'Job';
    final worker = application['worker'];
    final workerName = worker != null ? (worker['name'] ?? 'Professional Applicant') : 'Professional Applicant';
    final String? imageUrl = worker != null ? worker['profileImageUrl'] : null;
    
    final bool isActionable = status == 'PENDING' || status == 'REVIEWING';

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
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: AppColors.primary.withOpacity(0.1),
                  backgroundImage: imageUrl != null 
                    ? NetworkImage(ref.read(apiClientProvider).resolveMediaUrl(imageUrl))
                    : null,
                  child: imageUrl == null ? const Icon(LucideIcons.user, color: AppColors.primary) : null,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(jobTitle, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.primary, letterSpacing: 1)),
                      const SizedBox(height: 2),
                      Text(workerName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                    ],
                  ),
                ),
                _StatusBadge(status: status),
              ],
            ),
            const SizedBox(height: 20),
            if (application['coverLetter'] != null && application['coverLetter'].toString().isNotEmpty) ...[
              Text(
                'Note: ${application['coverLetter']}',
                style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, fontStyle: FontStyle.italic),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 20),
            ],
            
            if (isActionable) ...[
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _updateStatus(context, ref, 'ACCEPTED'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('ACCEPT', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => _updateStatus(context, ref, 'REJECTED'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        side: const BorderSide(color: AppColors.error),
                      ),
                      child: const Text('REJECT', style: TextStyle(color: AppColors.error, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ] else ...[
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    status == 'ACCEPTED' ? 'APPLICATION ACCEPTED' : 'APPLICATION REJECTED',
                    style: TextStyle(
                      color: status == 'ACCEPTED' ? AppColors.success : AppColors.error,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            ],
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: TextButton.icon(
                onPressed: () {
                  if (worker != null) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => WorkerProfileScreen(worker: worker)),
                    );
                  }
                },
                icon: const Icon(LucideIcons.user, size: 16),
                label: const Text('VIEW FULL PROFILE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                style: TextButton.styleFrom(foregroundColor: AppColors.primary),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _updateStatus(BuildContext context, WidgetRef ref, String status) async {
    try {
      final id = application['id'];
      await ref.read(apiClientProvider).dio.patch('/api/jobs/applications/$id/status', queryParameters: {'status': status});
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Application $status!')));
      onStatusUpdated();
    } catch (e) {
      print('Error updating status: $e');
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to update status.')));
    }
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color color;
    switch (status) {
      case 'ACCEPTED': color = AppColors.success; break;
      case 'REJECTED': color = AppColors.error; break;
      case 'REVIEWING': color = Colors.blue; break;
      default: color = Colors.orange;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        status,
        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }
}
