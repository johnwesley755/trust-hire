import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../providers/search_provider.dart';
import '../../../../core/providers/api_provider.dart';
import '../../../profile/presentation/screens/worker_profile_screen.dart';

class WorkerSearchScreen extends ConsumerStatefulWidget {
  const WorkerSearchScreen({super.key});

  @override
  ConsumerState<WorkerSearchScreen> createState() => _WorkerSearchScreenState();
}

class _WorkerSearchScreenState extends ConsumerState<WorkerSearchScreen> {
  final _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final searchState = ref.watch(workerSearchProvider);
    final workers = searchState.workers;

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
                'Find Talent',
                style: Theme.of(context).textTheme.displaySmall,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      onSubmitted: (val) {
                        ref.read(workerSearchProvider.notifier).searchWorkers(query: val);
                      },
                      decoration: const InputDecoration(
                        hintText: 'Search by skills, name, or level...',
                        prefixIcon: Icon(LucideIcons.users, size: 20),
                        contentPadding: EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  GestureDetector(
                    onTap: () => ref.read(workerSearchProvider.notifier).searchWorkers(query: _searchController.text),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(LucideIcons.filter, color: Colors.white, size: 20),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        
        // Results
        Expanded(
          child: searchState.isLoading 
          ? const Center(child: CircularProgressIndicator())
          : ListView(
            padding: const EdgeInsets.all(24),
            children: [
              FadeInUp(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${workers.length} Workers Available',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Icon(LucideIcons.listOrdered, color: AppColors.textTertiary, size: 16),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              
              if (workers.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 40),
                  child: Center(child: Text('No workers found matching your search.')),
                )
              else
                ...workers.map((worker) => _WorkerCard(
                  worker: worker,
                  name: worker['name'] ?? 'Verified Worker',
                  role: 'Certified Professional',
                  level: '${worker['level'] ?? 'L1'} Specialist',
                  rating: ((worker['trustScore'] ?? 0) / 20.0).toDouble(),
                  skills: (worker['skills'] as String? ?? '').split(',').where((s) => s.isNotEmpty).toList(),
                  imageUrl: worker['profileImageUrl'],
                  delay: 100,
                )).toList(),
            ],
          ),
        ),
      ],
    );
  }
}

class _WorkerCard extends ConsumerWidget {
  final Map<String, dynamic> worker;
  final String name;
  final String role;
  final String level;
  final double rating;
  final List<String> skills;
  final String? imageUrl;
  final int delay;

  const _WorkerCard({
    required this.worker,
    required this.name,
    required this.role,
    required this.level,
    required this.rating,
    required this.skills,
    this.imageUrl,
    required this.delay,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return FadeInUp(
      delay: Duration(milliseconds: delay),
      child: GestureDetector(
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => WorkerProfileScreen(worker: worker))),
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
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(20),
                      image: imageUrl != null ? DecorationImage(
                        image: NetworkImage(ref.read(apiClientProvider).resolveMediaUrl(imageUrl!)), 
                        fit: BoxFit.cover
                      ) : null,
                    ),
                    child: imageUrl == null ? const Icon(LucideIcons.user, color: AppColors.primary, size: 32) : null,
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Flexible(
                              child: Text(
                                name,
                                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            Row(
                              children: [
                                const Icon(LucideIcons.star, color: Colors.orange, size: 14),
                                const SizedBox(width: 4),
                                Text(
                                  rating.toStringAsFixed(1),
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Text(
                          role,
                          style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            level.toUpperCase(),
                            style: const TextStyle(color: AppColors.primary, fontSize: 8, fontWeight: FontWeight.w900),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const Divider(color: AppColors.border),
              const SizedBox(height: 16),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: skills.map((skill) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    skill,
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, fontWeight: FontWeight.w500),
                  ),
                )).toList(),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (context) => WorkerProfileScreen(worker: worker))),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppColors.primary),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('VIEW PROFILE'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Hiring request sent to $name!'))
                        );
                      },
                      child: const Text('HIRE NOW'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
