import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';

class ApplicationsScreen extends StatelessWidget {
  const ApplicationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              _ApplicationCard(
                jobTitle: 'Senior Delivery Partner',
                company: 'Amazon Logistics',
                status: 'PENDING',
                date: 'Applied 2 days ago',
                delay: 100,
              ),
              _ApplicationCard(
                jobTitle: 'Warehouse Supervisor',
                company: 'BigBasket',
                status: 'INTERVIEWING',
                date: 'Updated 5h ago',
                delay: 200,
              ),
              _ApplicationCard(
                jobTitle: 'Forklift Operator',
                company: 'DHL Express',
                status: 'ACCEPTED',
                date: 'Offer received yesterday',
                delay: 300,
              ),
              _ApplicationCard(
                jobTitle: 'Logistics Coordinator',
                company: 'Delhivery',
                status: 'REJECTED',
                date: 'Closed 1 week ago',
                delay: 400,
              ),
            ],
          ),
        ),
      ],
    );
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
      case 'INTERVIEWING': return AppColors.primary;
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
