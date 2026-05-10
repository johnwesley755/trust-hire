import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';

class WorkerSearchScreen extends StatefulWidget {
  const WorkerSearchScreen({super.key});

  @override
  State<WorkerSearchScreen> createState() => _WorkerSearchScreenState();
}

class _WorkerSearchScreenState extends State<WorkerSearchScreen> {
  final _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
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
                'Find Talent',
                style: Theme.of(context).textTheme.displaySmall,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      decoration: const InputDecoration(
                        hintText: 'Search by skills, name, or level...',
                        prefixIcon: Icon(LucideIcons.users, size: 20),
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
                    child: const Icon(LucideIcons.filter, color: Colors.white, size: 20),
                  ),
                ],
              ),
            ],
          ),
        ),
        
        // Results
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              FadeInUp(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '842 Workers Available',
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
              
              _WorkerCard(
                name: 'Habib Mohammed',
                role: 'Senior Delivery Executive',
                level: 'L4 Specialist',
                rating: 4.9,
                skills: const ['Express Delivery', 'Team Lead', 'Safety Cert'],
                delay: 100,
              ),
              _WorkerCard(
                name: 'Rajesh Kumar',
                role: 'Warehouse Supervisor',
                level: 'L3 Professional',
                rating: 4.7,
                skills: const ['Inventory Mgmt', 'Forklift Op'],
                delay: 200,
              ),
              _WorkerCard(
                name: 'Anjali Sharma',
                role: 'Logistics Coordinator',
                level: 'L4 Expert',
                rating: 5.0,
                skills: const ['Route Planning', 'Communication'],
                delay: 300,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _WorkerCard extends StatelessWidget {
  final String name;
  final String role;
  final String level;
  final double rating;
  final List<String> skills;
  final int delay;

  const _WorkerCard({
    required this.name,
    required this.role,
    required this.level,
    required this.rating,
    required this.skills,
    required this.delay,
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
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(LucideIcons.user, color: AppColors.primary, size: 32),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            name,
                            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
                          ),
                          Row(
                            children: [
                              const Icon(LucideIcons.star, color: Colors.orange, size: 14),
                              const SizedBox(width: 4),
                              Text(
                                rating.toString(),
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
                    onPressed: () {},
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
                    onPressed: () {},
                    child: const Text('HIRE NOW'),
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
