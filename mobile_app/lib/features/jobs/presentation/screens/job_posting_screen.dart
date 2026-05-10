import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';

class JobPostingScreen extends StatefulWidget {
  const JobPostingScreen({super.key});

  @override
  State<JobPostingScreen> createState() => _JobPostingScreenState();
}

class _JobPostingScreenState extends State<JobPostingScreen> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _locationController = TextEditingController();
  final _salaryController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            FadeInDown(
              child: Text(
                'Post New Job',
                style: Theme.of(context).textTheme.displaySmall,
              ),
            ),
            const SizedBox(height: 8),
            FadeInDown(
              delay: const Duration(milliseconds: 100),
              child: Text(
                'Fill in the details to find your next top talent.',
                style: TextStyle(color: AppColors.textSecondary),
              ),
            ),
            const SizedBox(height: 32),
            
            _buildSectionTitle('BASIC INFORMATION'),
            const SizedBox(height: 16),
            _buildTextField('Job Title', 'e.g., Senior Delivery Associate', _titleController, LucideIcons.briefcase),
            const SizedBox(height: 20),
            _buildTextField('Job Description', 'Describe roles and responsibilities...', _descController, LucideIcons.alignLeft, maxLines: 4),
            
            const SizedBox(height: 32),
            _buildSectionTitle('LOCATION & COMPENSATION'),
            const SizedBox(height: 16),
            _buildTextField('Location', 'e.g., Bangalore, KA', _locationController, LucideIcons.mapPin),
            const SizedBox(height: 20),
            _buildTextField('Salary Range', 'e.g., ₹25,000 - ₹35,000 / mo', _salaryController, LucideIcons.banknote),
            
            const SizedBox(height: 32),
            _buildSectionTitle('REQUIREMENTS'),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildChoiceChip('Full-time', true),
                _buildChoiceChip('Part-time', false),
                _buildChoiceChip('Immediate Joiner', true),
                _buildChoiceChip('Day Shift', false),
              ],
            ),
            
            const SizedBox(height: 48),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: AppColors.accent,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                ),
                child: const Text('PUBLISH JOB LISTING'),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 10,
        fontWeight: FontWeight.bold,
        letterSpacing: 1.5,
        color: AppColors.textTertiary,
      ),
    );
  }

  Widget _buildTextField(String label, String hint, TextEditingController controller, IconData icon, {int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          maxLines: maxLines,
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Padding(
              padding: const EdgeInsets.all(12),
              child: Icon(icon, size: 20, color: AppColors.primary),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildChoiceChip(String label, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.primary : AppColors.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isSelected ? AppColors.primary : AppColors.border),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.white : AppColors.textPrimary,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
