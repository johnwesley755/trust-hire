import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:image_picker/image_picker.dart';
import 'package:pinput/pinput.dart';
import '../../../../core/theme/app_colors.dart';
import '../providers/auth_provider.dart';

class SignUpScreen extends ConsumerStatefulWidget {
  final String role;
  const SignUpScreen({super.key, required this.role});

  @override
  ConsumerState<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends ConsumerState<SignUpScreen> {
  final _pageController = PageController();
  final _formKey = GlobalKey<FormState>();
  
  // Form Controllers
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  
  XFile? _pickedFile;
  bool _otpSent = false;
  bool _isLoading = false;
  String? _error;

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() => _pickedFile = pickedFile);
    }
  }

  Future<void> _handleSendOtp() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
        _error = null;
      });

      final success = await ref.read(authProvider.notifier).sendOtp(_emailController.text);
      
      if (!mounted) return;
      setState(() => _isLoading = false);

      if (success) {
        setState(() => _otpSent = true);
        _pageController.nextPage(
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeInOut,
        );
      } else {
        setState(() => _error = ref.read(authProvider).error);
      }
    }
  }

  Future<void> _handleRegister(String otp) async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      String? imageUrl;
      if (_pickedFile != null) {
        imageUrl = await ref.read(authRepositoryProvider).uploadMedia(_pickedFile!);
      }

      final success = await ref.read(authProvider.notifier).register({
        'firstName': _firstNameController.text,
        'lastName': _lastNameController.text,
        'email': _emailController.text,
        'password': _passwordController.text,
        'phoneNumber': '+91${_phoneController.text}',
        'profile_image_url': imageUrl,
        'role': widget.role,
        'otp': otp,
      });

      if (!mounted) return;
      setState(() => _isLoading = false);

      if (!success) {
        setState(() => _error = ref.read(authProvider).error);
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _error = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isWorker = widget.role == 'WORKER';

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Custom Back Button
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () {
                      if (_otpSent) {
                        setState(() => _otpSent = false);
                        _pageController.previousPage(
                          duration: const Duration(milliseconds: 400),
                          curve: Curves.easeInOut,
                        );
                      } else {
                        Navigator.pop(context);
                      }
                    },
                    icon: const Icon(LucideIcons.arrowLeft),
                  ),
                ],
              ),
            ),
            
            if (_error != null)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.red.withOpacity(0.2)),
                  ),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.alertCircle, color: Colors.red, size: 20),
                      const SizedBox(width: 12),
                      Expanded(child: Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 12))),
                    ],
                  ),
                ),
              ),

            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  _buildDetailsStep(isWorker),
                  _buildOtpStep(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailsStep(bool isWorker) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            FadeInDown(
              child: Text(
                isWorker ? 'Create Worker Profile' : 'Create Employer Account',
                style: Theme.of(context).textTheme.displaySmall?.copyWith(
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            const SizedBox(height: 8),
            FadeInDown(
              delay: const Duration(milliseconds: 100),
              child: Text(
                isWorker 
                  ? "Join India's most trusted network and earn more."
                  : "Hire the India's most verified workers.",
                style: TextStyle(color: AppColors.textSecondary),
              ),
            ),
            const SizedBox(height: 32),
            
            Center(
              child: GestureDetector(
                onTap: _pickImage,
                child: Stack(
                  children: [
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(32),
                        border: Border.all(color: AppColors.border, width: 2),
                      ),
                      child: _pickedFile != null
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(30),
                            child: kIsWeb 
                              ? Image.network(_pickedFile!.path, fit: BoxFit.cover)
                              : Image.network(_pickedFile!.path, fit: BoxFit.cover), // Simplified for now as XFile handles it
                          )
                        : const Icon(LucideIcons.camera, color: AppColors.textTertiary, size: 32),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(
                          color: AppColors.accent,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(LucideIcons.plus, size: 14, color: AppColors.primary),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
            
            Row(
              children: [
                Expanded(child: _buildTextField('First Name', _firstNameController, LucideIcons.user)),
                const SizedBox(width: 16),
                Expanded(child: _buildTextField('Last Name', _lastNameController, LucideIcons.user)),
              ],
            ),
            const SizedBox(height: 20),
            _buildTextField('Email Address', _emailController, LucideIcons.mail, keyboardType: TextInputType.emailAddress),
            const SizedBox(height: 20),
            _buildPhoneField(),
            const SizedBox(height: 20),
            _buildTextField('Password', _passwordController, LucideIcons.lock, isPassword: true),
            
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _handleSendOtp,
                child: _isLoading 
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                  : const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('VERIFY IDENTITY'),
                        SizedBox(width: 8),
                        Icon(LucideIcons.arrowRight, size: 18),
                      ],
                    ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildOtpStep() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          FadeInDown(
            child: Text(
              'Verify Identity',
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            "We've sent a 6-digit code to ${_emailController.text}",
            style: TextStyle(color: AppColors.textSecondary),
          ),
          const SizedBox(height: 48),
          
          Center(
            child: Pinput(
              length: 6,
              onCompleted: _handleRegister,
              defaultPinTheme: PinTheme(
                width: 56,
                height: 64,
                textStyle: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
              ),
            ),
          ),
          
          const SizedBox(height: 48),
          if (_isLoading)
            const Center(child: CircularProgressIndicator())
          else
            const Center(child: Text('Enter the code to finish registration', style: TextStyle(color: AppColors.textSecondary))),
          
          const SizedBox(height: 48),
          Center(
            child: TextButton(
              onPressed: () {
                setState(() => _otpSent = false);
                _pageController.previousPage(
                  duration: const Duration(milliseconds: 400),
                  curve: Curves.easeInOut,
                );
              },
              child: const Text('Go back and edit details', style: TextStyle(color: AppColors.textSecondary)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, {bool isPassword = false, TextInputType? keyboardType}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary)),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          obscureText: isPassword,
          keyboardType: keyboardType,
          validator: (val) => val!.isEmpty ? 'Required' : null,
          decoration: InputDecoration(
            hintText: label,
            prefixIcon: Icon(icon, size: 18),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
      ],
    );
  }

  Widget _buildPhoneField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Mobile Number', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary)),
        const SizedBox(height: 8),
        TextFormField(
          controller: _phoneController,
          keyboardType: TextInputType.phone,
          validator: (val) => val!.length < 10 ? 'Enter valid number' : null,
          decoration: InputDecoration(
            prefixIcon: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
              child: const Text('+91', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
            ),
            hintText: '98765 43210',
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
      ],
    );
  }
}
