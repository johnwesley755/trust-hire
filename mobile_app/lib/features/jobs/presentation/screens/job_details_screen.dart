import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../providers/job_details_provider.dart';

class JobDetailsScreen extends ConsumerWidget {
  final String jobId;

  const JobDetailsScreen({super.key, required this.jobId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final jobState = ref.watch(jobDetailsProvider(jobId));

    return Scaffold(
      backgroundColor: const Color(0xFFF5F4EF),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF1F3F34)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Job Details',
          style: TextStyle(
            color: Color(0xFF1F3F34),
            fontWeight: FontWeight.w900,
            letterSpacing: -0.5,
          ),
        ),
      ),
      body: jobState.isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFFACD15)))
          : jobState.error != null
              ? Center(child: Text('Error: ${jobState.error}'))
              : jobState.job == null
                  ? const Center(child: Text('Job not found'))
                  : _buildJobDetails(context, jobState.job!),
    );
  }

  Widget _buildJobDetails(BuildContext context, Map<String, dynamic> job) {
    final title = job['title'] ?? 'Job Title';
    final companyName = job['employerName'] ?? job['industry'] ?? 'Company';
    final description = job['description'] ?? 'No description provided.';
    final reqList = job['requiredSkills'] as List<dynamic>? ?? [];
    final requirements = reqList.isNotEmpty 
        ? '• ${reqList.join('\n• ')}' 
        : 'No specific requirements.';
        
    final locationStr = job['city'] ?? job['location']?.toString().split(',').first ?? 'Location not specified';
    
    final salaryVal = job['budget'] ?? job['hourlyRate'];
    final salary = salaryVal != null
        ? '\$${salaryVal}'
        : 'Salary not specified';

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          FadeInDown(
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF1F3F34),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                      color: const Color(0xFF1F3F34).withOpacity(0.2),
                      blurRadius: 20,
                      offset: const Offset(0, 10)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFACD15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      job['jobType']?.toString().toUpperCase() ?? 'FULL-TIME',
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF002117),
                        letterSpacing: 1,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    companyName,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.white.withOpacity(0.7),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      _buildInfoChip(LucideIcons.mapPin, locationStr),
                      _buildInfoChip(LucideIcons.dollarSign, salary),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),
          FadeInUp(
            delay: const Duration(milliseconds: 200),
            child: const Text(
              'Job Description',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: Color(0xFF1F3F34),
              ),
            ),
          ),
          const SizedBox(height: 12),
          FadeInUp(
            delay: const Duration(milliseconds: 300),
            child: Text(
              description,
              style: TextStyle(
                fontSize: 14,
                color: const Color(0xFF1F3F34).withOpacity(0.8),
                height: 1.6,
              ),
            ),
          ),
          const SizedBox(height: 32),
          FadeInUp(
            delay: const Duration(milliseconds: 400),
            child: const Text(
              'Requirements',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: Color(0xFF1F3F34),
              ),
            ),
          ),
          const SizedBox(height: 12),
          FadeInUp(
            delay: const Duration(milliseconds: 500),
            child: Text(
              requirements,
              style: TextStyle(
                fontSize: 14,
                color: const Color(0xFF1F3F34).withOpacity(0.8),
                height: 1.6,
              ),
            ),
          ),
          const SizedBox(height: 48),
        ],
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: const Color(0xFFFACD15), size: 14),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}
