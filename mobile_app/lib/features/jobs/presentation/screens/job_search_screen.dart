import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../providers/job_search_provider.dart';
import '../providers/worker_applications_provider.dart';
import '../../../dashboard/presentation/providers/dashboard_provider.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../shared/presentation/screens/notification_screen.dart';
import '../../../shared/presentation/providers/notification_provider.dart';
import '../../../shared/presentation/widgets/trust_hire_header.dart';

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
              if (job['expiresAt'] != null) ...[
                const SizedBox(height: 8),
                Builder(builder: (context) {
                  final exp = DateTime.tryParse(job['expiresAt'].toString());
                  if (exp == null) return const SizedBox.shrink();
                  final days = exp.difference(DateTime.now()).inDays;
                  final label = days < 0 ? 'Expired' : days == 0 ? 'Expires today' : 'Expires in $days days';
                  final color = days < 0 ? Colors.red : days <= 3 ? Colors.orange : const Color(0xFF4a6b5e);
                  return Row(
                    children: [
                      Icon(LucideIcons.calendarClock, size: 14, color: color),
                      const SizedBox(width: 6),
                      Text(label, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 13)),
                    ],
                  );
                }),
              ],

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
    final auth = ref.watch(authProvider);
    final notificationState = ref.watch(notificationProvider);
    
    final firstName = auth.user?['first_name'] ?? 'Professional';
    final profileImageUrl = auth.user?['profile_image_url'] as String?;
    final unreadNotifications = notificationState.unreadCount.toString();

    return Column(
      children: [
        // Search Header
        const Padding(
          padding: EdgeInsets.fromLTRB(24, 20, 24, 8),
          child: TrustHireHeader(),
        ),
              // const SizedBox(height: 24),
              // Text(
              //   'Find Work',
              //   style: Theme.of(context).textTheme.displaySmall?.copyWith(
              //     fontWeight: FontWeight.w900,
              //     color: const Color(0xFF1B3F34),
              //     letterSpacing: -1,
              //   ),
              // ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _searchController,
                      onChanged: (val) {
                        ref.read(jobSearchProvider.notifier).search(val);
                      },
                      decoration: InputDecoration(
                        hintText: 'Search for opportunities...',
                        hintStyle: const TextStyle(color: Colors.grey, fontWeight: FontWeight.w500),
                        prefixIcon: const Icon(LucideIcons.search, size: 20, color: Colors.grey),
                        contentPadding: const EdgeInsets.symmetric(vertical: 16),
                        filled: true,
                        fillColor: const Color(0xFFE9E8E3),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(30),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFACD15),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: const Icon(LucideIcons.slidersHorizontal, color: Color(0xFF002117), size: 20),
                  ),
                ],
              ),
        ),
        
        // // Insight Card
        // Padding(
        //   padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
        //   child: Container(
        //     padding: const EdgeInsets.all(20),
        //     decoration: BoxDecoration(
        //       color: const Color(0xFFFACD15),
        //       borderRadius: BorderRadius.circular(16),
        //       boxShadow: [
        //         BoxShadow(
        //           color: const Color(0xFFFACD15).withOpacity(0.2),
        //           blurRadius: 20,
        //           offset: const Offset(0, 10),
        //         ),
        //       ],
        //     ),
        //     child: Row(
        //       crossAxisAlignment: CrossAxisAlignment.start,
        //       children: [
        //         Container(
        //           padding: const EdgeInsets.all(8),
        //           decoration: BoxDecoration(
        //             color: const Color(0xFF002117).withOpacity(0.1),
        //             borderRadius: BorderRadius.circular(12),
        //           ),
        //           child: const Icon(LucideIcons.lightbulb, color: Color(0xFF002117), size: 24),
        //         ),
        //         const SizedBox(width: 16),
        //         Expanded(
        //           child: Column(
        //             crossAxisAlignment: CrossAxisAlignment.start,
        //             children: [
        //               const Text(
        //                 'TRUSTHIRE INSIGHT',
        //                 style: TextStyle(
        //                   color: Color(0xFF002117),
        //                   fontWeight: FontWeight.w900,
        //                   fontSize: 10,
        //                   letterSpacing: 1.5,
        //                 ),
        //               ),
        //               const SizedBox(height: 4),
        //               const Text(
        //                 "Jobs with 'Urgent' badges receive 4.2x more applications.",
        //                 style: TextStyle(
        //                   color: Color(0xFF002117),
        //                   fontWeight: FontWeight.bold,
        //                   fontSize: 14,
        //                   height: 1.2,
        //                 ),
        //               ),
        //               const SizedBox(height: 8),
        //               Text(
        //                 'SMART TIP • 2M AGO',
        //                 style: TextStyle(
        //                   color: const Color(0xFF002117).withOpacity(0.7),
        //                   fontWeight: FontWeight.bold,
        //                   fontSize: 10,
        //                 ),
        //               ),
        //             ],
        //           ),
        //         ),
        //       ],
        //     ),
        //   ),
        // ),

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
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Nearby Jobs',
                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  color: const Color(0xFF1B3F34),
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                              const SizedBox(height: 2),
                              const Text(
                                'Based on your skills and location',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: const Color(0xFFc7ebdb),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Text(
                              'LATEST', 
                              style: TextStyle(color: Color(0xFF002117), fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    
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
                          expiresAt: job['expiresAt']?.toString(),
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
  final String? expiresAt;

  const _JobCard({
    required this.title,
    required this.company,
    required this.location,
    required this.salary,
    required this.tags,
    required this.delay,
    required this.onViewDetails,
    this.expiresAt,
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
          borderRadius: BorderRadius.circular(16),
          border: const Border(
            left: BorderSide(color: Color(0xFFFACD15), width: 4),
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF1B3F34).withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFACD15),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text('URGENT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF002117), letterSpacing: 1)),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        title,
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w900,
                          color: const Color(0xFF1B3F34),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        company,
                        style: const TextStyle(
                          color: Color(0xFF1B3F34),
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(salary, style: const TextStyle(color: Color(0xFF1B3F34), fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: -0.5)),
                    const Text('PER MONTH', style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w900)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(LucideIcons.mapPin, size: 14, color: Colors.grey),
                const SizedBox(width: 4),
                Text(location, style: const TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.w600)),
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
                    color: const Color(0xFFFACD15).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    tag.toUpperCase(),
                    style: const TextStyle(
                      color: Color(0xFF1B3F34),
                      fontWeight: FontWeight.w900,
                      fontSize: 10,
                      letterSpacing: 1,
                    ),
                  ),
                )).toList(),
              ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFACD15),
                  foregroundColor: const Color(0xFF002117),
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                onPressed: onViewDetails,
                child: const Text('VIEW DETAILS', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14, letterSpacing: 1)),
              ),
            ),
            // Expiry chip below the button
            if (expiresAt != null)
              Builder(builder: (context) {
                final exp = DateTime.tryParse(expiresAt!);
                if (exp == null) return const SizedBox.shrink();
                final days = exp.difference(DateTime.now()).inDays;
                final label = days < 0 ? 'Expired' : days == 0 ? 'Expires today' : 'Expires in $days days';
                final color = days < 0 ? Colors.red.shade100 : days <= 3 ? Colors.orange.shade100 : const Color(0xFFe8f5e9);
                final textColor = days < 0 ? Colors.red.shade700 : days <= 3 ? Colors.orange.shade700 : const Color(0xFF2e7d32);
                return Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(LucideIcons.calendarClock, size: 12, color: textColor),
                      const SizedBox(width: 4),
                      Text(label, style: TextStyle(color: textColor, fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                );
              }),
          ],
        ),
      ),
    );
  }
}

