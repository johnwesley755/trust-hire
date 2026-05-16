import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:animate_do/animate_do.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../data/repositories/profile_repository.dart';
import '../../../../core/providers/api_provider.dart';
import 'package:geolocator/geolocator.dart';
import 'package:dio/dio.dart';

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  return ProfileRepository(ref.watch(apiClientProvider));
});

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final _pageController = PageController();
  int _currentStep = 0;
  bool _isLoading = false;
  bool _isDetectingLocation = false;

  // Shared Data
  final _bioController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  double? _lat;
  double? _lng;

  // Worker Specific
  final _skillsController = TextEditingController();
  final _experienceController = TextEditingController();
  final _hourlyRateController = TextEditingController();
  List<String> _selectedSkills = [];

  // Employer Specific
  final _companyNameController = TextEditingController();
  final _websiteController = TextEditingController();
  String? _selectedIndustry;

  final List<String> _industries = [
    'CONSTRUCTION', 'MAINTENANCE', 'LOGISTICS', 'COOKING_CHEF', 
    'HOSPITALITY', 'DOMESTIC_HELP', 'RETAIL', 'SECURITY', 
    'AGRICULTURE', 'MANUFACTURING', 'GARMENT', 'BEAUTY', 'HEALTHCARE'
  ];

  @override
  void dispose() {
    _pageController.dispose();
    _bioController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _skillsController.dispose();
    _experienceController.dispose();
    _hourlyRateController.dispose();
    _companyNameController.dispose();
    _websiteController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < 2) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    } else {
      _submitOnboarding();
    }
  }

  Future<void> _detectLocation() async {
    setState(() => _isDetectingLocation = true);
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) throw 'Location permissions are denied';
      }
      
      if (permission == LocationPermission.deniedForever) throw 'Location permissions are permanently denied';

      Position position = await Geolocator.getCurrentPosition();
      setState(() {
        _lat = position.latitude;
        _lng = position.longitude;
      });

      final dio = Dio();
      final response = await dio.get(
        'https://nominatim.openstreetmap.org/reverse',
        queryParameters: {
          'format': 'json',
          'lat': position.latitude,
          'lon': position.longitude,
          'zoom': 18,
          'addressdetails': 1,
        },
        options: Options(headers: {'Accept-Language': 'en'}),
      );

      if (response.data != null) {
        final address = response.data['display_name'];
        final addrData = response.data['address'];
        final city = addrData['city'] ?? addrData['town'] ?? addrData['village'] ?? addrData['suburb'] ?? 'Unknown City';
        
        setState(() {
          _addressController.text = address;
          _cityController.text = city;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Location Error: $e')));
    } finally {
      setState(() => _isDetectingLocation = false);
    }
  }

  Future<void> _submitOnboarding() async {
    setState(() => _isLoading = true);
    final auth = ref.read(authProvider);
    final repo = ref.read(profileRepositoryProvider);

    try {
      if (auth.role == 'WORKER') {
        await repo.updateWorkerProfile({
          'bio': _bioController.text,
          'skills': _selectedSkills.join(', '),
          'experienceYears': int.tryParse(_experienceController.text) ?? 0,
          'hourlyRate': double.tryParse(_hourlyRateController.text) ?? 0.0,
          'location': _addressController.text,
          'city': _cityController.text,
          'latitude': _lat,
          'longitude': _lng,
          'isAvailable': true,
        });
      } else {
        await repo.updateEmployerProfile({
          'companyName': _companyNameController.text,
          'industry': _selectedIndustry,
          'companyWebsite': _websiteController.text,
          'profileBio': _bioController.text,
          'address': _addressController.text,
          'city': _cityController.text,
          'latitude': _lat,
          'longitude': _lng,
        });
      }

      // Sync onboarding status
      await ref.read(authProvider.notifier).sync(auth.role!);
      
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Onboarding completed successfully!')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);
    final isWorker = auth.role == 'WORKER';

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(isWorker),
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                onPageChanged: (idx) => setState(() => _currentStep = idx),
                children: isWorker ? _buildWorkerSteps() : _buildEmployerSteps(),
              ),
            ),
            _buildFooter(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(bool isWorker) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'TrustHire',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: AppColors.primary,
                ),
              ),
              Text(
                'Step ${_currentStep + 1} of 3',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: (_currentStep + 1) / 3,
            backgroundColor: AppColors.border,
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
            borderRadius: BorderRadius.circular(8),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildWorkerSteps() {
    return [
      _buildStep(
        title: 'Tell us about yourself',
        subtitle: 'Let potential employers know who you are and what you do.',
        content: [
          _buildTextField('Professional Bio', _bioController, LucideIcons.user, maxLines: 4),
        ],
      ),
      _buildStep(
        title: 'Expertise & Skills',
        subtitle: 'What are you best at? Add your skills and experience.',
        content: [
          _buildTextField('Years of Experience', _experienceController, LucideIcons.briefcase, keyboardType: TextInputType.number),
          const SizedBox(height: 24),
          _buildTextField('Expected Hourly Rate (₹)', _hourlyRateController, LucideIcons.indianRupee, keyboardType: TextInputType.number),
          const SizedBox(height: 24),
          const Text('Select Skills', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            children: ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Delivery', 'Cooking']
                .map((skill) => FilterChip(
                      label: Text(skill),
                      selected: _selectedSkills.contains(skill),
                      onSelected: (selected) {
                        setState(() {
                          if (selected) {
                            _selectedSkills.add(skill);
                          } else {
                            _selectedSkills.remove(skill);
                          }
                        });
                      },
                      selectedColor: AppColors.primary.withOpacity(0.2),
                      checkmarkColor: AppColors.primary,
                    ))
                .toList(),
          ),
        ],
      ),
      _buildStep(
        title: 'Your Location',
        subtitle: 'We use this to find jobs near you.',
        content: [
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: _isDetectingLocation ? null : _detectLocation,
              icon: _isDetectingLocation 
                ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2))
                : const Icon(LucideIcons.mapPin, size: 18),
              label: Text(_isDetectingLocation ? 'DETECTING...' : 'USE MY CURRENT LOCATION'),
            ),
          ),
          const SizedBox(height: 24),
          _buildTextField('City', _cityController, LucideIcons.mapPin),
          const SizedBox(height: 24),
          _buildTextField('Full Address', _addressController, LucideIcons.home, maxLines: 3),
        ],
      ),
    ];
  }

  List<Widget> _buildEmployerSteps() {
    return [
      _buildStep(
        title: 'Business Identity',
        subtitle: 'Let\'s start with the basics of your company.',
        content: [
          _buildTextField('Company Name', _companyNameController, LucideIcons.building),
          const SizedBox(height: 24),
          _buildTextField('Website (Optional)', _websiteController, LucideIcons.globe),
        ],
      ),
      _buildStep(
        title: 'Industry & Profile',
        subtitle: 'What does your business do?',
        content: [
          const Text('Select Industry', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            value: _selectedIndustry,
            items: _industries.map((i) => DropdownMenuItem(value: i, child: Text(i))).toList(),
            onChanged: (val) => setState(() => _selectedIndustry = val),
            decoration: InputDecoration(
              prefixIcon: const Icon(LucideIcons.factory),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          const SizedBox(height: 24),
          _buildTextField('Business Bio', _bioController, LucideIcons.fileText, maxLines: 4),
        ],
      ),
      _buildStep(
        title: 'Business Location',
        subtitle: 'Where is your primary office located?',
        content: [
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: _isDetectingLocation ? null : _detectLocation,
              icon: _isDetectingLocation 
                ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2))
                : const Icon(LucideIcons.mapPin, size: 18),
              label: Text(_isDetectingLocation ? 'DETECTING...' : 'USE MY CURRENT LOCATION'),
            ),
          ),
          const SizedBox(height: 24),
          _buildTextField('City', _cityController, LucideIcons.mapPin),
          const SizedBox(height: 24),
          _buildTextField('Full Business Address', _addressController, LucideIcons.home, maxLines: 3),
        ],
      ),
    ];
  }

  Widget _buildStep({required String title, required String subtitle, required List<Widget> content}) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          FadeInDown(
            duration: const Duration(milliseconds: 500),
            child: Text(
              title,
              style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppColors.primary),
            ),
          ),
          const SizedBox(height: 8),
          FadeInDown(
            delay: const Duration(milliseconds: 100),
            child: Text(
              subtitle,
              style: const TextStyle(color: AppColors.textSecondary, fontSize: 16),
            ),
          ),
          const SizedBox(height: 48),
          ...content,
        ],
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, {int maxLines = 1, TextInputType? keyboardType}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          maxLines: maxLines,
          keyboardType: keyboardType,
          decoration: InputDecoration(
            hintText: label,
            prefixIcon: Icon(icon, size: 18),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
      ],
    );
  }

  Widget _buildFooter() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Row(
        children: [
          if (_currentStep > 0)
            Expanded(
              child: OutlinedButton(
                onPressed: () => _pageController.previousPage(
                  duration: const Duration(milliseconds: 400),
                  curve: Curves.easeInOut,
                ),
                child: const Text('BACK'),
              ),
            ),
          if (_currentStep > 0) const SizedBox(width: 16),
          Expanded(
            flex: 2,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _nextStep,
              child: _isLoading 
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : Text(_currentStep == 2 ? 'COMPLETE SETUP' : 'NEXT STEP'),
            ),
          ),
        ],
      ),
    );
  }
}
