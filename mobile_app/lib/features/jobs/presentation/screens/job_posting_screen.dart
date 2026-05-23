import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:geolocator/geolocator.dart';
import 'package:dio/dio.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../dashboard/presentation/providers/dashboard_provider.dart';

class JobPostingScreen extends ConsumerStatefulWidget {
  const JobPostingScreen({super.key});

  @override
  ConsumerState<JobPostingScreen> createState() => _JobPostingScreenState();
}

class _JobPostingScreenState extends ConsumerState<JobPostingScreen> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _locationController = TextEditingController();
  final _cityController = TextEditingController();
  final _budgetController = TextEditingController();
  final _experienceController = TextEditingController();
  final _skillController = TextEditingController();
  
  List<String> _selectedSkills = [];
  bool _isPublishing = false;
  bool _isDetectingLocation = false;
  double? _lat;
  double? _lon;

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _locationController.dispose();
    _cityController.dispose();
    _budgetController.dispose();
    _experienceController.dispose();
    _skillController.dispose();
    super.dispose();
  }

  Future<void> _detectLocation() async {
    setState(() => _isDetectingLocation = true);
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      
      if (permission == LocationPermission.whileInUse || permission == LocationPermission.always) {
        Position position = await Geolocator.getCurrentPosition();
        _lat = position.latitude;
        _lon = position.longitude;

        // Reverse Geocoding using Nominatim (OpenStreetMap)
        final dio = Dio();
        final response = await dio.get(
          'https://nominatim.openstreetmap.org/reverse',
          queryParameters: {
            'format': 'json',
            'lat': _lat,
            'lon': _lon,
            'zoom': 18,
            'addressdetails': 1,
          },
          options: Options(headers: {'User-Agent': 'TrustHire-App'}),
        );

        if (response.statusCode == 200) {
          final address = response.data['address'];
          final displayName = response.data['display_name'];
          final city = address['city'] ?? address['town'] ?? address['village'] ?? address['suburb'] ?? '';
          
          setState(() {
            _locationController.text = displayName ?? "Detected Location";
            _cityController.text = city;
          });
        }
        
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Location & Address detected!')));
      }
    } catch (e) {
      debugPrint('Location Error: $e');
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error detecting address: $e')));
    } finally {
      setState(() => _isDetectingLocation = false);
    }
  }

  void _addSkill() {
    final skill = _skillController.text.trim();
    if (skill.isNotEmpty && !_selectedSkills.contains(skill)) {
      setState(() {
        _selectedSkills.add(skill);
        _skillController.clear();
      });
    }
  }

  Future<void> _handlePublishJob() async {
    if (_titleController.text.isEmpty || _descController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in at least title and description')),
      );
      return;
    }

    setState(() => _isPublishing = true);
    try {
      final double? budget = double.tryParse(_budgetController.text);
      final int? exp = int.tryParse(_experienceController.text);

      await ref.read(jobRepositoryProvider).createJob({
        'title': _titleController.text,
        'description': _descController.text,
        'location': _locationController.text,
        'city': _cityController.text,
        'budget': budget,
        'experienceYearsRequired': exp,
        'requiredSkills': _selectedSkills,
        'latitude': _lat,
        'longitude': _lon,
        'status': 'OPEN',
      });
      
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Job published successfully!')),
      );
      
      _titleController.clear();
      _descController.clear();
      _locationController.clear();
      _cityController.clear();
      _budgetController.clear();
      _experienceController.clear();
      _selectedSkills = [];
      setState(() { _lat = null; _lon = null; });
      
      ref.read(dashboardProvider.notifier).refreshDashboard();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error publishing job: $e')));
    } finally {
      setState(() => _isPublishing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            FadeInDown(child: const Text('TrustHire', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.primary))),
            const SizedBox(height: 4),
            FadeInDown(child: Text('Post New Job', style: Theme.of(context).textTheme.displaySmall)),
            const SizedBox(height: 32),
            
            _buildSectionTitle('BASIC INFORMATION'),
            _buildTextField('Job Title', _titleController, LucideIcons.briefcase, hint: 'e.g. Senior Electrician'),
            const SizedBox(height: 20),
            _buildTextField('Job Description', _descController, LucideIcons.alignLeft, hint: 'Describe roles and responsibilities...', maxLines: 4),
            
            const SizedBox(height: 32),
            _buildSectionTitle('LOCATION & REQUIREMENTS'),
            Row(
              children: [
                Expanded(child: _buildTextField('Full Address', _locationController, LucideIcons.mapPin, hint: 'e.g. 123 Street, City')),
                const SizedBox(width: 12),
                Padding(
                  padding: const EdgeInsets.only(top: 25),
                  child: IconButton.filled(
                    onPressed: _isDetectingLocation ? null : _detectLocation,
                    icon: _isDetectingLocation ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Icon(LucideIcons.locate),
                    style: IconButton.styleFrom(backgroundColor: AppColors.primary, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            _buildTextField('City', _cityController, LucideIcons.building, hint: 'e.g. Bangalore'),
            const SizedBox(height: 20),
            _buildMapPreview(),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(child: _buildTextField('Budget (₹)', _budgetController, LucideIcons.banknote, hint: 'e.g. 25000')),
                const SizedBox(width: 16),
                Expanded(child: _buildTextField('Experience (Years)', _experienceController, LucideIcons.history, hint: 'e.g. 2')),
              ],
            ),
            
            const SizedBox(height: 32),
            _buildSectionTitle('REQUIRED SKILLS'),
            Row(
              children: [
                Expanded(child: _buildTextField('Skill', _skillController, LucideIcons.plusCircle, hint: 'Add a skill...')),
                const SizedBox(width: 12),
                Padding(
                  padding: const EdgeInsets.only(top: 25),
                  child: IconButton.filled(
                    onPressed: _addSkill,
                    icon: const Icon(LucideIcons.plus),
                    style: IconButton.styleFrom(backgroundColor: AppColors.accent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: (_selectedSkills).map((skill) => Chip(
                label: Text(skill, style: const TextStyle(fontSize: 12)),
                onDeleted: () => setState(() => _selectedSkills.remove(skill)),
                deleteIcon: const Icon(LucideIcons.x, size: 14),
                backgroundColor: AppColors.primary.withOpacity(0.05),
                side: BorderSide(color: AppColors.primary.withOpacity(0.1)),
              )).toList(),
            ),
            
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isPublishing ? null : _handlePublishJob,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                child: _isPublishing 
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('PUBLISH JOB POST', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1)),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return FadeInLeft(
      child: Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textTertiary, letterSpacing: 1)),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, {String? hint, int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        TextField(
          controller: controller,
          maxLines: maxLines,
          keyboardType: label.contains('Budget') || label.contains('Experience') ? TextInputType.number : TextInputType.text,
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, size: 20),
          ),
        ),
      ],
    );
  }

  Widget _buildMapPreview() {
    return FadeInUp(
      child: Container(
        height: 150,
        width: double.infinity,
        decoration: BoxDecoration(
          color: _lat != null ? AppColors.primary.withOpacity(0.05) : AppColors.background,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: _lat != null ? AppColors.primary.withOpacity(0.2) : AppColors.border),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                _lat != null ? LucideIcons.mapPin : LucideIcons.map, 
                color: _lat != null ? AppColors.primary : AppColors.textTertiary.withOpacity(0.5), 
                size: 32
              ),
              const SizedBox(height: 12),
              Text(
                _lat != null ? 'Location Pin: $_lat, $_lon' : 'Detect location to see preview', 
                style: TextStyle(
                  color: _lat != null ? AppColors.primary : AppColors.textTertiary, 
                  fontSize: 12,
                  fontWeight: _lat != null ? FontWeight.bold : FontWeight.normal
                )
              ),
              if (_lat != null) ...[
                const SizedBox(height: 4),
                const Text('Address & City verified', style: TextStyle(color: AppColors.textSecondary, fontSize: 10)),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
