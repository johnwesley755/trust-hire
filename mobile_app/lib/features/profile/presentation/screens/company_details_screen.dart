import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../../core/providers/api_provider.dart';

class CompanyDetailsScreen extends ConsumerStatefulWidget {
  const CompanyDetailsScreen({super.key});

  @override
  ConsumerState<CompanyDetailsScreen> createState() => _CompanyDetailsScreenState();
}

class _CompanyDetailsScreenState extends ConsumerState<CompanyDetailsScreen> {
  final _companyNameController = TextEditingController();
  final _websiteController = TextEditingController();
  final _industryController = TextEditingController();
  final _addressController = TextEditingController();
  final _bioController = TextEditingController();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  Future<void> _fetchProfile() async {
    try {
      final response = await ref.read(apiClientProvider).dio.get('/api/employer/profile');
      final data = response.data['data'];
      
      if (data != null) {
        setState(() {
          _companyNameController.text = data['companyName'] ?? '';
          _industryController.text = data['industry'] ?? '';
          _websiteController.text = data['companyWebsite'] ?? '';
          _addressController.text = data['address'] ?? '';
          _bioController.text = data['profileBio'] ?? '';
        });
      }
    } catch (e) {
      debugPrint('Error fetching employer profile: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Company Details', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                _buildTextField('Company Name', _companyNameController, LucideIcons.building),
                const SizedBox(height: 20),
                _buildTextField('Industry', _industryController, LucideIcons.briefcase),
                const SizedBox(height: 20),
                _buildTextField('Website', _websiteController, LucideIcons.globe),
                const SizedBox(height: 20),
                _buildTextField('About Company', _bioController, LucideIcons.info, maxLines: 3),
                const SizedBox(height: 20),
                _buildTextField('Business Address', _addressController, LucideIcons.mapPin, maxLines: 3),
                const SizedBox(height: 40),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Company details updated!'))
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: const Text('SAVE COMPANY INFO', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, {int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          maxLines: maxLines,
          decoration: InputDecoration(
            prefixIcon: Padding(
              padding: const EdgeInsets.only(bottom: 0),
              child: Icon(icon, size: 20, color: AppColors.primary),
            ),
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide.none,
            ),
          ),
        ),
      ],
    );
  }
}
