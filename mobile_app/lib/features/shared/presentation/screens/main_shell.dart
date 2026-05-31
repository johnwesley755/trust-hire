import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:trust_hire/features/employer/presentation/screens/employer_dashboard_screen.dart';
import 'package:trust_hire/features/jobs/presentation/screens/applications_screen.dart';
import 'package:trust_hire/features/jobs/presentation/screens/job_posting_screen.dart';
import 'package:trust_hire/features/jobs/presentation/screens/job_search_screen.dart';
import 'package:trust_hire/features/profile/presentation/screens/profile_screen.dart';
import 'package:trust_hire/features/search/presentation/screens/worker_search_screen.dart';
import 'package:trust_hire/features/worker/presentation/screens/worker_tracker_screen.dart';

import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class MainShell extends ConsumerStatefulWidget {
  const MainShell({super.key});

  @override
  ConsumerState<MainShell> createState() => _MainShellState();
}

class _MainShellState extends ConsumerState<MainShell> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final role = ref.watch(authProvider).role;
    final isWorker = role == 'WORKER';

    final items = isWorker 
      ? const [
          BottomNavigationBarItem(icon: Icon(LucideIcons.search), label: 'Jobs'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.activity), label: 'Tracker'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.briefcase), label: 'Applications'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.user), label: 'Profile'),
        ]

      : const [
          BottomNavigationBarItem(icon: Icon(LucideIcons.layoutDashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.plusCircle), label: 'Post Job'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.users), label: 'Talent'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.settings), label: 'Settings'),
        ];

    final pages = isWorker 
      ? [
          const JobSearchScreen(),
          const WorkerTrackerScreen(),
          const ApplicationsScreen(),
          const ProfileScreen(),
        ]

      : [
          const EmployerDashboardScreen(),
          const JobPostingScreen(),
          const WorkerSearchScreen(),
          const ProfileScreen(),
        ];

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: pages[_selectedIndex],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textTertiary,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10),
        items: items,
      ),
    );
  }
}
