import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:animate_do/animate_do.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../../core/providers/api_provider.dart';

class PersonalInfoScreen extends ConsumerStatefulWidget {
  const PersonalInfoScreen({super.key});

  @override
  ConsumerState<PersonalInfoScreen> createState() => _PersonalInfoScreenState();
}

class _PersonalInfoScreenState extends ConsumerState<PersonalInfoScreen> {
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _emailController;
  
  String? _imageUrl;
  bool _isVerified = false;

  @override
  void initState() {
    super.initState();
    final user = ref.read(authProvider).user;
    _firstNameController = TextEditingController(text: user?['first_name'] ?? '');
    _lastNameController = TextEditingController(text: user?['last_name'] ?? '');
    _emailController = TextEditingController(text: user?['email'] ?? '');
    
    _fetchEmployerProfile();
  }

  Future<void> _fetchEmployerProfile() async {
    try {
      final response = await ref.read(apiClientProvider).dio.get('/api/employer/profile');
      final data = response.data['data'];
      if (data != null && mounted) {
        setState(() {
          _imageUrl = data['profileImageUrl'] ?? data['profile_image_url'];
          _isVerified = data['isVerified'] ?? false;
        });
      }
    } catch (e) {
      debugPrint('Error fetching profile: $e');
    }
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    if (user != null) {
      if (_firstNameController.text.isEmpty) _firstNameController.text = user['first_name'] ?? '';
      if (_lastNameController.text.isEmpty) _lastNameController.text = user['last_name'] ?? '';
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
            FadeInDown(
              child: Center(
                child: Stack(
                  alignment: Alignment.bottomRight,
                  children: [
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.primary.withOpacity(0.1),
                        border: Border.all(color: AppColors.primary.withOpacity(0.2), width: 2),
                        image: _imageUrl != null
                            ? DecorationImage(
                                image: NetworkImage(ref.read(apiClientProvider).resolveMediaUrl(_imageUrl!)),
                                fit: BoxFit.cover,
                              )
                            : null,
                      ),
                      child: _imageUrl == null
                          ? const Icon(LucideIcons.user, size: 40, color: AppColors.primary)
                          : null,
                    ),
                    if (_isVerified)
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: AppColors.success,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(LucideIcons.check, color: Colors.white, size: 16),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            if (_isVerified)
              FadeInDown(
                delay: const Duration(milliseconds: 100),
                child: const Text(
                  'Verified Employer',
                  style: TextStyle(color: AppColors.success, fontWeight: 
                  FontWeight.bold, fontSize: 12),
                ),
              ),
            const SizedBox(height: 32),
            _buildTextField('First Name', _firstNameController, LucideIcons.user),
            const SizedBox(height: 20),
            _buildTextField('Last Name', _lastNameController, LucideIcons.user),
            const SizedBox(height: 20),
            _buildTextField('Email Address', _emailController, LucideIcons.mail, enabled: false),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
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
    return FadeInUp(
      child: Column(
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
      ),
    );
  }
}
