import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
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
                      onChanged: (val) {
                        ref.read(workerSearchProvider.notifier).updateFilters(query: val);
                      },
                      decoration: const InputDecoration(
                        hintText: 'Search by skills, name, or level...',
                        prefixIcon: Icon(LucideIcons.search, size: 20),
                        contentPadding: EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  GestureDetector(
                    onTap: () => _showFilterBottomSheet(context),
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
                  role: (worker['skills'] as String? ?? '').split(',').firstWhere((s) => s.trim().isNotEmpty, orElse: () => 'Professional'),
                  level: '${worker['level'] ?? 'L1'} Specialist',
                  rating: ((worker['trustScore'] ?? 0) / 20.0).toDouble(),
                  skills: (worker['skills'] as String? ?? '').split(',').where((s) => s.trim().isNotEmpty).toList(),
                  location: worker['city'] ?? worker['location'] ?? 'Location not specified',
                  imageUrl: worker['profileImageUrl'],
                  delay: 100,

                )).toList(),
            ],
          ),
        ),
      ],
    );
  }

  void _showFilterBottomSheet(BuildContext context) {
    final searchState = ref.read(workerSearchProvider);
    String location = searchState.city;
    String level = searchState.level;
    String skill = searchState.skill;
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(32))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                left: 24, right: 24, top: 32
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Filter Talent', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 24),
                  
                  // Location Filter
                  const Text('Location (City)', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: TextEditingController(text: location),
                    onChanged: (val) => location = val,
                    decoration: InputDecoration(
                      hintText: 'e.g. Chennai, Mumbai...',
                      prefixIcon: const Icon(LucideIcons.mapPin, size: 20, color: AppColors.primary),
                      filled: true,
                      fillColor: AppColors.background,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Skill Filter
                  const Text('Primary Skill', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: TextEditingController(text: skill),
                    onChanged: (val) => skill = val,
                    decoration: InputDecoration(
                      hintText: 'e.g. ELECTRICAL, COOKING...',
                      prefixIcon: const Icon(LucideIcons.briefcase, size: 20, color: AppColors.primary),
                      filled: true,
                      fillColor: AppColors.background,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Level Filter
                  const Text('Professional Level', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    value: level.isEmpty ? null : level,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: AppColors.background,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                    ),
                    hint: const Text('Select Level'),
                    items: const [
                      DropdownMenuItem(value: 'L1', child: Text('L1 Entry Specialist')),
                      DropdownMenuItem(value: 'L2', child: Text('L2 Intermediate')),
                      DropdownMenuItem(value: 'L3', child: Text('L3 Advanced')),
                      DropdownMenuItem(value: 'L4', child: Text('L4 Master')),
                    ],
                    onChanged: (val) {
                      setModalState(() => level = val ?? '');
                    },
                  ),
                  
                  const SizedBox(height: 40),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            ref.read(workerSearchProvider.notifier).clearFilters();
                            _searchController.clear();
                            Navigator.pop(context);
                          },
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            side: const BorderSide(color: AppColors.error),
                          ),
                          child: const Text('CLEAR ALL', style: TextStyle(color: AppColors.error, fontWeight: FontWeight.bold)),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        flex: 2,
                        child: ElevatedButton(
                          onPressed: () {
                            ref.read(workerSearchProvider.notifier).updateFilters(
                              city: location,
                              level: level,
                              skill: skill,
                            );
                            Navigator.pop(context);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          child: const Text('APPLY FILTERS', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            );
          }
        );
      }
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
  final String location;
  final String? imageUrl;
  final int delay;

  const _WorkerCard({
    required this.worker,
    required this.name,
    required this.role,
    required this.level,
    required this.rating,
    required this.skills,
    required this.location,
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
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(LucideIcons.mapPin, size: 12, color: AppColors.textSecondary),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                location,
                                style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
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
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (context) => WorkerProfileScreen(worker: worker))),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.primary),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('VIEW PROFILE'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
