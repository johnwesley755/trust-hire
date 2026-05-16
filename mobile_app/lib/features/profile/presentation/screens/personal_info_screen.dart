import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class PersonalInfoScreen extends ConsumerStatefulWidget {
  const PersonalInfoScreen({super.key});

  @override
  ConsumerState<PersonalInfoScreen> createState() => _PersonalInfoScreenState();
}

class _PersonalInfoScreenState extends ConsumerState<PersonalInfoScreen> {
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _phoneController;
  late TextEditingController _emailController;

  @override
  void initState() {
    super.initState();
    final user = ref.read(authProvider).user;
    _firstNameController = TextEditingController(text: user?['first_name'] ?? '');
    _lastNameController = TextEditingController(text: user?['last_name'] ?? '');
    _phoneController = TextEditingController(text: user?['phone_number'] ?? '');
    _emailController = TextEditingController(text: user?['email'] ?? '');
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    // Update controllers if user state changes
    if (user != null) {
      if (_firstNameController.text.isEmpty) _firstNameController.text = user['first_name'] ?? '';
      if (_lastNameController.text.isEmpty) _lastNameController.text = user['last_name'] ?? '';
      if (_phoneController.text.isEmpty) _phoneController.text = user['phone_number'] ?? '';
      if (_emailController.text.isEmpty) _emailController.text = user['email'] ?? '';
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Personal Information', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            _buildTextField('First Name', _firstNameController, LucideIcons.user),
            const SizedBox(height: 20),
            _buildTextField('Last Name', _lastNameController, LucideIcons.user),
            const SizedBox(height: 20),
            _buildTextField('Phone Number', _phoneController, LucideIcons.phone),
            const SizedBox(height: 20),
            _buildTextField('Email Address', _emailController, LucideIcons.mail, enabled: false),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
                  // Implement update logic
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Profile updated successfully!'))
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('SAVE CHANGES', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, {bool enabled = true}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          enabled: enabled,
          decoration: InputDecoration(
            prefixIcon: Icon(icon, size: 20, color: AppColors.primary),
            filled: true,
            fillColor: enabled ? Colors.white : Colors.grey[200],
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
