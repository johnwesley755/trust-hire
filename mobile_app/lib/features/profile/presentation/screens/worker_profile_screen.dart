import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:animate_do/animate_do.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/providers/api_provider.dart';
import '../../../dashboard/presentation/providers/dashboard_provider.dart';

class WorkerProfileScreen extends ConsumerStatefulWidget {
  final Map<String, dynamic> worker;

  const WorkerProfileScreen({super.key, required this.worker});

  @override
  ConsumerState<WorkerProfileScreen> createState() => _WorkerProfileScreenState();
}

class _WorkerProfileScreenState extends ConsumerState<WorkerProfileScreen> {
  Map<String, dynamic>? _trustDetails;
  bool _isLoadingTrust = true;

  @override
  void initState() {
    super.initState();
    _fetchTrustDetails();
  }

  Future<void> _fetchTrustDetails() async {
    try {
      final userId = widget.worker['userId'];
      final response = await ref.read(apiClientProvider).dio.get('/api/worker/trust-score/$userId');
      setState(() {
        _trustDetails = response.data['data'];
        _isLoadingTrust = false;
      });
    } catch (e) {
      print('Error fetching trust score: $e');
      setState(() => _isLoadingTrust = false);
    }
  }

  Future<void> _handleHireNow() async {
    try {
      // 1. Get employer jobs
      final jobs = ref.read(dashboardProvider).activeJobs;
      if (jobs.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('You need to post a job first before hiring!'))
        );
        return;
      }

      // 2. Show job selection dialog
      final selectedJob = await showDialog<dynamic>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Select a Job'),
          content: SizedBox(
            width: double.maxFinite,
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: jobs.length,
              itemBuilder: (context, index) {
                final job = jobs[index];
                return ListTile(
                  title: Text(job['title']),
                  subtitle: Text(job['location'] ?? ''),
                  onTap: () => Navigator.pop(context, job),
                );
              },
            ),
          ),
        ),
      );

      if (selectedJob != null) {
        final jobId = selectedJob['id'];
        final workerId = widget.worker['userId'];
        
        await ref.read(apiClientProvider).dio.post('/api/jobs/applications', data: {
          'jobId': jobId,
          'workerId': workerId,
          'coverLetter': 'Hiring invitation from Employer',
          'status': 'PENDING'
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Invitation sent to ${widget.worker['name']} for ${selectedJob['title']}!'))
          );
        }
      }
    } catch (e) {
      print('Error hiring worker: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to send hiring invitation.'))
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final String name = widget.worker['name'] ?? 'Verified Worker';
    final String? imageUrl = widget.worker['profileImageUrl'] ?? widget.worker['profile_image_url'];
    final String level = '${widget.worker['level'] ?? 'L1'} Specialist';
    final double rating = ((widget.worker['trustScore'] ?? 0) / 20.0).toDouble();
    final List<String> skills = (widget.worker['skills'] as String? ?? '').split(',').where((s) => s.isNotEmpty).toList();
    final String location = widget.worker['location'] ?? 'Location not specified';
    final bool isVerified = widget.worker['isVerified'] ?? false;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: imageUrl != null 
                ? Image.network(ref.read(apiClientProvider).resolveMediaUrl(imageUrl), fit: BoxFit.cover)
                : Container(
                    color: AppColors.primary.withOpacity(0.1),
                    child: const Icon(LucideIcons.user, size: 100, color: AppColors.primary),
                  ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  FadeInUp(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(name, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900)),
                                  if (isVerified) ...[
                                    const SizedBox(width: 8),
                                    const Icon(LucideIcons.checkCircle, color: AppColors.success, size: 20),
                                  ],
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(level, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: Row(
                            children: [
                              const Icon(LucideIcons.star, color: Colors.amber, size: 18),
                              const SizedBox(width: 4),
                              Text(rating.toStringAsFixed(1), style: const TextStyle(fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildLocationInfo(location),
                  const SizedBox(height: 32),
                  _buildSection('About', widget.worker['bio'] ?? 'No bio available for this professional.'),
                  const SizedBox(height: 32),
                  _buildSkills(skills),
                  const SizedBox(height: 32),
                  _buildTrustScoreDetails(),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationInfo(String location) {
    return FadeInUp(
      child: Row(
        children: [
          const Icon(LucideIcons.mapPin, size: 18, color: AppColors.textSecondary),
          const SizedBox(width: 8),
          Expanded(child: Text(location, style: const TextStyle(color: AppColors.textSecondary))),
        ],
      ),
    );
  }

  Widget _buildSection(String title, String content) {
    return FadeInUp(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Text(content, style: const TextStyle(color: AppColors.textSecondary, height: 1.5)),
        ],
      ),
    );
  }

  Widget _buildSkills(List<String> skills) {
    return FadeInUp(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Skills', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: skills.map((skill) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.05),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.primary.withOpacity(0.1)),
              ),
              child: Text(skill, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600, fontSize: 12)),
            )).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildTrustScoreDetails() {
    if (_isLoadingTrust) return const Center(child: CircularProgressIndicator());
    if (_trustDetails == null) return const SizedBox();

    return FadeInUp(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.accent.withOpacity(0.1),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.accent.withOpacity(0.2)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(LucideIcons.shieldCheck, color: AppColors.primary),
                const SizedBox(width: 12),
                Text('Trust Score: ${_trustDetails!['score']}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primary)),
              ],
            ),
            const SizedBox(height: 16),
            _buildTrustRow(LucideIcons.fingerprint, 'Identity Verified', _trustDetails!['identityVerified']),
            _buildTrustRow(LucideIcons.award, 'Verified Skills', (_trustDetails!['skillsVerifiedCount'] ?? 0) > 0),
            _buildTrustRow(LucideIcons.clock, 'Reliability Rate', (_trustDetails!['reliabilityRate'] ?? 0.0) * 100 > 90),
          ],
        ),
      ),
    );
  }

  Widget _buildTrustRow(IconData icon, String label, bool success) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(icon, size: 16, color: success ? AppColors.success : AppColors.textTertiary),
          const SizedBox(width: 8),
          Text(label, style: TextStyle(color: success ? AppColors.textSecondary : AppColors.textTertiary, fontSize: 13)),
          const Spacer(),
          Icon(success ? LucideIcons.check : LucideIcons.x, size: 14, color: success ? AppColors.success : AppColors.error),
        ],
      ),
    );
  }
}
