import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';

class JobSearchScreen extends StatefulWidget {
  const JobSearchScreen({super.key});

  @override
  State<JobSearchScreen> createState() => _JobSearchScreenState();
}

class _JobSearchScreenState extends State<JobSearchScreen> {
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
                'Find Work',
                style: Theme.of(context).textTheme.displaySmall,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _searchController,
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
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              FadeInUp(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '324 Jobs Found',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    TextButton(
                      onPressed: () {},
                      child: const Text('Clear Filters'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              
              _JobCard(
                title: 'Senior Delivery Partner',
                company: 'Amazon Logistics',
                location: 'Bangalore, KA',
                salary: '₹25,000 - ₹35,000 / mo',
                tags: const ['Full-time', 'Verified'],
                delay: 100,
              ),
              _JobCard(
                title: 'Warehouse Supervisor',
                company: 'BigBasket',
                location: 'Chennai, TN',
                salary: '₹30,000 - ₹40,000 / mo',
                tags: const ['Immediate', 'Day Shift'],
                delay: 200,
              ),
              _JobCard(
                title: 'Forklift Operator',
                company: 'DHL Express',
                location: 'Mumbai, MH',
                salary: '₹18,000 - ₹22,000 / mo',
                tags: const ['L3 Skills', 'Insurance'],
                delay: 300,
              ),
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

  const _JobCard({
    required this.title,
    required this.company,
    required this.location,
    required this.salary,
    required this.tags,
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
            Wrap(
              spacing: 8,
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
                onPressed: () {},
                child: const Text('VIEW DETAILS'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
