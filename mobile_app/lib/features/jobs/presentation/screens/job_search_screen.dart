import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../providers/job_search_provider.dart';
import '../providers/worker_applications_provider.dart';
import '../../../dashboard/presentation/providers/dashboard_provider.dart';

class JobSearchScreen extends ConsumerStatefulWidget {
  const JobSearchScreen({super.key});

  @override
  ConsumerState<JobSearchScreen> createState() => _JobSearchScreenState();
}

class _JobSearchScreenState extends ConsumerState<JobSearchScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(jobSearchProvider.notifier).search('');
    });
  }

  void _showJobDetailsBottomSheet(BuildContext context, Map<String, dynamic> job) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (_, scrollController) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          padding: const EdgeInsets.all(24),
          child: ListView(
            controller: scrollController,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 24),
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      job['title'] ?? 'Job Opportunity',
                      style: Theme.of(context).textTheme.displaySmall,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(LucideIcons.x, color: AppColors.textSecondary),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                job['employerName'] ?? job['industry'] ?? 'Registered Partner',
                style: const TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  const Icon(LucideIcons.mapPin, size: 16, color: AppColors.textSecondary),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      '${job['city'] ?? ''}, ${job['location'] ?? ''}',
                      style: const TextStyle(color: AppColors.textSecondary),
                      overflow: TextOverflow.ellipsis,
                      maxLines: 2,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(LucideIcons.banknote, size: 16, color: AppColors.textSecondary),
                  const SizedBox(width: 6),
                  Text(
                    'Budget: ₹${job['budget'] ?? 'N/A'}',
                    style: const TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              const Divider(),
              const SizedBox(height: 16),
              const Text(
                'Description',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),
              Text(
                job['description'] ?? 'No description provided.',
                style: const TextStyle(color: AppColors.textSecondary, height: 1.5),
              ),
              const SizedBox(height: 24),
              const Text(
                'Required Skills',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 12),
              Builder(
                builder: (context) {
                  List<String> sheetSkills = [];
                  if (job['requiredSkills'] != null) {
                    if (job['requiredSkills'] is String) {
                      sheetSkills = (job['requiredSkills'] as String)
                          .split(',')
                          .map((s) => s.trim())
                          .where((s) => s.isNotEmpty)
                          .toList();
                    } else if (job['requiredSkills'] is List) {
                      sheetSkills = (job['requiredSkills'] as List).map((e) => e.toString()).toList();
                    }
                  }

                  if (sheetSkills.isNotEmpty) {
                    return Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: sheetSkills.map((skill) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          skill.toUpperCase(),
                          style: const TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                            fontSize: 10,
                          ),
                        ),
                      )).toList(),
                    );
                  } else {
                    return const Text('No specific skills listed.', style: TextStyle(color: AppColors.textTertiary));
                  }
                },
              ),
              const SizedBox(height: 40),
              
              // Apply Button
              Consumer(
                builder: (context, ref, child) {
                  final appsState = ref.watch(workerApplicationsProvider);
                  final targetJobIdString = (job['jobId'] ?? job['id'] ?? '').toString();
                  final isAlreadyApplied = appsState.applications.any((app) {
                    final appId = (app['jobId'] ?? app['job_id'] ?? '').toString();
                    return appId == targetJobIdString && targetJobIdString.isNotEmpty;
                  });

                  return SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isAlreadyApplied ? Colors.grey[300] : AppColors.primary,
                        elevation: isAlreadyApplied ? 0 : 2,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      onPressed: isAlreadyApplied
                          ? null
                          : () async {
                              try {
                                final targetJobId = job['jobId'] ?? job['id'];
                                if (targetJobId == null || targetJobId.toString() == 'null') {
                                  throw Exception('Job ID is missing');
                                }
                                await ref.read(jobRepositoryProvider).applyForJob(targetJobId.toString());
                                
                                // Refresh worker applications list
                                ref.read(workerApplicationsProvider.notifier).fetchApplications();
                                
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Applied successfully!')),
                                );
                              } catch (e) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Failed to apply: $e')),
                                );
                              }
                            },
                      child: Text(
                        isAlreadyApplied ? 'APPLIED' : 'APPLY NOW',
                        style: TextStyle(
                          fontWeight: FontWeight.bold, 
                          color: isAlreadyApplied ? Colors.grey[600] : Colors.white,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final searchState = ref.watch(jobSearchProvider);

    return Column(
      children: [
        // Search Header
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
                'Find Work',
                style: Theme.of(context).textTheme.displaySmall,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      onChanged: (val) {
                        ref.read(jobSearchProvider.notifier).search(val);
                      },
                      decoration: const InputDecoration(
                        hintText: 'Search jobs, skills, or roles...',
                        prefixIcon: Icon(LucideIcons.search, size: 20),
                        contentPadding: EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(LucideIcons.slidersHorizontal, color: Colors.white, size: 20),
                  ),
                ],
              ),
            ],
          ),
        ),
        
        // Results
        Expanded(
          child: searchState.isLoading
              ? const Center(
                  child: Padding(
                    padding: EdgeInsets.all(24.0),
                    child: CircularProgressIndicator(),
                  ),
                )
              : ListView(
                  padding: const EdgeInsets.all(24),
                  children: [
                    FadeInUp(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '${searchState.jobs.length} Jobs Found',
                            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              _searchController.clear();
                              ref.read(jobSearchProvider.notifier).search('');
                            },
                            child: const Text('Clear Filters'),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    if (searchState.jobs.isEmpty)
                      const Center(
                        child: Padding(
                          padding: EdgeInsets.all(48.0),
                          child: Text(
                            'No jobs matching your search.',
                            style: TextStyle(color: AppColors.textSecondary),
                          ),
                        ),
                      )
                    else
                      ...searchState.jobs.asMap().entries.map((entry) {
                        final index = entry.key;
                        final job = entry.value as Map<String, dynamic>;
                        
                        final title = job['title'] ?? 'Job';
                        final company = job['employerName'] ?? job['industry'] ?? 'Registered Partner';
                        final city = job['city'] ?? job['location'] ?? 'Anywhere';
                        final budget = '₹${job['budget'] ?? 'N/A'}';
                        
                        List<String> tags = [];
                        if (job['requiredSkills'] != null) {
                          if (job['requiredSkills'] is String) {
                            tags = (job['requiredSkills'] as String)
                                .split(',')
                                .map((s) => s.trim())
                                .where((s) => s.isNotEmpty)
                                .toList();
                          } else if (job['requiredSkills'] is List) {
                            tags = (job['requiredSkills'] as List).map((e) => e.toString()).toList();
                          }
                        }

                        return _JobCard(
                          title: title,
                          company: company,
                          location: city,
                          salary: budget,
                          tags: tags,
                          delay: index * 100,
                          onViewDetails: () => _showJobDetailsBottomSheet(context, job),
                        );
                      }).toList(),
                  ],
                ),
        ),
      ],
    );
  }
}

class _JobCard extends StatelessWidget {
  final String title;
  final String company;
  final String location;
  final String salary;
  final List<String> tags;
  final int delay;
  final VoidCallback onViewDetails;

  const _JobCard({
    required this.title,
    required this.company,
    required this.location,
    required this.salary,
    required this.tags,
    required this.delay,
    required this.onViewDetails,
  });

  @override
  Widget build(BuildContext context) {
    return FadeInUp(
      delay: Duration(milliseconds: delay),
      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: AppColors.border),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.02),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        company,
                        style: const TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(LucideIcons.bookmark, color: AppColors.textTertiary, size: 20),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                const Icon(LucideIcons.mapPin, size: 14, color: AppColors.textSecondary),
                const SizedBox(width: 4),
                Text(location, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                const SizedBox(width: 16),
                const Icon(LucideIcons.banknote, size: 14, color: AppColors.textSecondary),
                const SizedBox(width: 4),
                Text(salary, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
              ],
            ),
            const SizedBox(height: 20),
            if (tags.isNotEmpty)
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: tags.map((tag) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.accent.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    tag.toUpperCase(),
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w900,
                      fontSize: 8,
                      letterSpacing: 1,
                    ),
                  ),
                )).toList(),
              ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: onViewDetails,
                child: const Text('VIEW DETAILS'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

