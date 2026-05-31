import 'dart:io' show File;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:animate_do/animate_do.dart';
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/providers/api_provider.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class IdentityVerificationScreen extends ConsumerStatefulWidget {
  const IdentityVerificationScreen({super.key});

  @override
  ConsumerState<IdentityVerificationScreen> createState() => _IdentityVerificationScreenState();
}

class _IdentityVerificationScreenState extends ConsumerState<IdentityVerificationScreen> {
  int _currentStep = 1; // 1: Aadhaar, 2: Face Capture, 3: Success
  XFile? _documentFile;
  XFile? _selfieFile;
  bool _isUploading = false;
  String? _errorMessage;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = ref.read(authProvider).user;
      final isVerified = user?['identity_verified'] ?? false;
      if (isVerified) {
        setState(() {
          _currentStep = 3;
        });
      }
    });
  }

  Future<void> _pickDocument(ImageSource source) async {
    try {
      final file = await _picker.pickImage(source: source, imageQuality: 80);
      if (file != null) {
        setState(() {
          _documentFile = file;
          _errorMessage = null;
        });
      }
    } catch (e) {
      setState(() => _errorMessage = 'Failed to capture image');
    }
  }

  Future<void> _pickSelfie() async {
    try {
      final file = await _picker.pickImage(source: ImageSource.camera, imageQuality: 80, preferredCameraDevice: CameraDevice.front);
      if (file != null) {
        setState(() {
          _selfieFile = file;
          _errorMessage = null;
        });
      }
    } catch (e) {
      setState(() => _errorMessage = 'Failed to capture selfie');
    }
  }

  Future<void> _submitDocument() async {
    if (_documentFile == null) return;
    setState(() {
      _isUploading = true;
      _errorMessage = null;
    });

    try {
      final dio = ref.read(apiClientProvider).dio;
      final bytes = await _documentFile!.readAsBytes();
      final formData = FormData.fromMap({
        'file': MultipartFile.fromBytes(bytes, filename: 'aadhaar_doc.jpg'),
      });

      await dio.post('/api/verification/upload-doc', data: formData);
      
      setState(() {
        _currentStep = 2;
        _isUploading = false;
      });
    } catch (e) {
      print('Document upload error: $e');
      setState(() {
        _isUploading = false;
        _errorMessage = 'Failed to upload document. Please try again.';
      });
    }
  }

  Future<void> _submitSelfie() async {
    if (_selfieFile == null) return;
    setState(() {
      _isUploading = true;
      _errorMessage = null;
    });

    try {
      final dio = ref.read(apiClientProvider).dio;
      final bytes = await _selfieFile!.readAsBytes();
      final formData = FormData.fromMap({
        'file': MultipartFile.fromBytes(bytes, filename: 'selfie.jpg'),
      });

      await dio.post('/api/verification/capture-live', data: formData);
      
      // Sync local user state immediately to reflect new identity_verified status
      await ref.read(authProvider.notifier).sync('WORKER');

      setState(() {
        _currentStep = 3;
        _isUploading = false;
      });
    } catch (e) {
      print('Selfie upload error: $e');
      setState(() {
        _isUploading = false;
        _errorMessage = 'Biometric match failed. Please try again in better lighting.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Identity Verification',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Step Indicators
              if (_currentStep < 3) _buildStepIndicators(),
              const SizedBox(height: 32),
              
              // Error Display
              if (_errorMessage != null) ...[
                FadeInDown(
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.error.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.error.withOpacity(0.2)),
                    ),
                    child: Row(
                      children: [
                        const Icon(LucideIcons.alertTriangle, color: AppColors.error),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            _errorMessage!,
                            style: const TextStyle(
                              color: AppColors.error,
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
              ],

              // Active Step Body
              Expanded(
                child: SingleChildScrollView(
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: _buildCurrentStepView(),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepIndicators() {
    return Row(
      children: [
        _buildStepBadge(1, 'Aadhaar Verification', _currentStep >= 1),
        const SizedBox(width: 12),
        Expanded(
          child: Container(
            height: 2,
            color: _currentStep > 1 ? AppColors.primary : AppColors.border,
          ),
        ),
        const SizedBox(width: 12),
        _buildStepBadge(2, 'Biometric Match', _currentStep >= 2),
      ],
    );
  }

  Widget _buildStepBadge(int step, String label, bool active) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: active ? AppColors.primary : Colors.white,
            border: Border.all(
              color: active ? AppColors.primary : AppColors.border,
              width: 2,
            ),
          ),
          child: Center(
            child: Text(
              step.toString(),
              style: TextStyle(
                color: active ? Colors.white : AppColors.textSecondary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          label,
          style: TextStyle(
            color: active ? AppColors.textPrimary : AppColors.textTertiary,
            fontWeight: active ? FontWeight.bold : FontWeight.normal,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildCurrentStepView() {
    switch (_currentStep) {
      case 1:
        return _buildAadhaarStep();
      case 2:
        return _buildBiometricStep();
      case 3:
        return _buildSuccessStep();
      default:
        return const SizedBox();
    }
  }

  Widget _buildAadhaarStep() {
    return Column(
      key: const ValueKey(1),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        FadeInUp(
          child: const Text(
            'Upload Aadhaar Card',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900),
          ),
        ),
        const SizedBox(height: 8),
        FadeInUp(
          delay: const Duration(milliseconds: 100),
          child: const Text(
            'Provide a clear picture of your Indian Aadhaar Card (front side) to begin your instant audit sequence.',
            style: TextStyle(color: AppColors.textSecondary, height: 1.5),
          ),
        ),
        const SizedBox(height: 32),
        FadeInUp(
          delay: const Duration(milliseconds: 200),
          child: GestureDetector(
            onTap: _isUploading ? null : () => _showImageSourceDialog(context),
            child: Container(
              height: 220,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.border),
              ),
              child: _documentFile != null
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(23),
                      child: kIsWeb
                          ? Image.network(
                              _documentFile!.path,
                              fit: BoxFit.cover,
                            )
                          : Image.file(
                              File(_documentFile!.path),
                              fit: BoxFit.cover,
                            ),
                    )
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.05),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(LucideIcons.fileText, color: AppColors.primary, size: 36),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Upload Aadhaar Document',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Tap to capture or choose photo',
                          style: TextStyle(color: AppColors.textTertiary, fontSize: 12),
                        ),
                      ],
                    ),
            ),
          ),
        ),
        const SizedBox(height: 48),
        if (_documentFile != null)
          FadeInUp(
            child: ElevatedButton(
              onPressed: _isUploading ? null : _submitDocument,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: _isUploading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Text('SUBMIT & CONTINUE', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
      ],
    );
  }

  Widget _buildBiometricStep() {
    return Column(
      key: const ValueKey(2),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        FadeInUp(
          child: const Text(
            'Biometric Face Match',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900),
          ),
        ),
        const SizedBox(height: 8),
        FadeInUp(
          delay: const Duration(milliseconds: 100),
          child: const Text(
            'Take a quick portrait selfie to verify this matches your Aadhaar Card record.',
            style: TextStyle(color: AppColors.textSecondary, height: 1.5),
          ),
        ),
        const SizedBox(height: 32),
        FadeInUp(
          delay: const Duration(milliseconds: 200),
          child: GestureDetector(
            onTap: _isUploading ? null : _pickSelfie,
            child: Container(
              height: 260,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.border, width: 3),
              ),
              child: _selfieFile != null
                  ? ClipOval(
                      child: kIsWeb
                          ? Image.network(
                              _selfieFile!.path,
                              fit: BoxFit.cover,
                            )
                          : Image.file(
                              File(_selfieFile!.path),
                              fit: BoxFit.cover,
                            ),
                    )
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: AppColors.accent.withOpacity(0.05),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(LucideIcons.camera, color: AppColors.accent, size: 36),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Capture Selfie',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Tap to trigger front camera',
                          style: TextStyle(color: AppColors.textTertiary, fontSize: 12),
                        ),
                      ],
                    ),
            ),
          ),
        ),
        const SizedBox(height: 48),
        if (_selfieFile != null)
          FadeInUp(
            child: ElevatedButton(
              onPressed: _isUploading ? null : _submitSelfie,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: _isUploading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Text('SUBMIT & START MATCH', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
      ],
    );
  }

  Widget _buildSuccessStep() {
    return Column(
      key: const ValueKey(3),
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SizedBox(height: 40),
        ElasticIn(
          child: Center(
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                color: AppColors.success,
                shape: BoxShape.circle,
              ),
              child: const Icon(LucideIcons.shieldCheck, color: Colors.white, size: 64),
            ),
          ),
        ),
        const SizedBox(height: 32),
        FadeInUp(
          child: const Text(
            'Verification Successful!',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900),
          ),
        ),
        const SizedBox(height: 12),
        FadeInUp(
          delay: const Duration(milliseconds: 100),
          child: const Text(
            'Your identity has been fully verified and registered with the TrustHire network. Your profile now features a Verified Worker Badge.',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.textSecondary, height: 1.5, fontSize: 15),
          ),
        ),
        const SizedBox(height: 48),
        FadeInUp(
          delay: const Duration(milliseconds: 200),
          child: ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 18),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Text('RETURN TO PROFILE', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ),
      ],
    );
  }

  void _showImageSourceDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Select Document Source',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            ListTile(
              leading: const Icon(LucideIcons.camera, color: AppColors.primary),
              title: const Text('Take Photo', style: TextStyle(fontWeight: FontWeight.w600)),
              onTap: () {
                Navigator.pop(context);
                _pickDocument(ImageSource.camera);
              },
            ),
            ListTile(
              leading: const Icon(LucideIcons.image, color: AppColors.primary),
              title: const Text('Choose from Gallery', style: TextStyle(fontWeight: FontWeight.w600)),
              onTap: () {
                Navigator.pop(context);
                _pickDocument(ImageSource.gallery);
              },
            ),
          ],
        ),
      ),
    );
  }
}
