import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:trust_hire/core/theme/app_theme.dart';
import 'package:trust_hire/features/auth/presentation/providers/auth_provider.dart';
import 'package:trust_hire/features/auth/presentation/screens/role_selection_screen.dart';
import 'package:trust_hire/features/shared/presentation/screens/main_shell.dart';
import 'package:trust_hire/features/shared/presentation/widgets/session_expired_overlay.dart';

import 'package:trust_hire/features/profile/presentation/screens/onboarding_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: TrustHireApp(),
    ),
  );
}

class TrustHireApp extends ConsumerWidget {
  const TrustHireApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    Widget home;
    if (authState.isLoading) {
      home = const SplashScreen();
    } else if (authState.isAuthenticated) {
      if (authState.onboarded) {
        home = const MainShell();
      } else {
        home = const OnboardingScreen();
      }
    } else {
      home = const RoleSelectionScreen();
    }

    return MaterialApp(
      key: ValueKey('${authState.isAuthenticated}_${authState.onboarded}'),
      title: 'TrustHire',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: home,
      builder: (context, child) {
        return Stack(
          children: [
            child!,
            const SessionExpiredOverlay(),
          ],
        );
      },
    );
  }
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.lightTheme.scaffoldBackgroundColor,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'TrustHire',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w900,
                color: Color(0xFF1F3F34), // AppColors.primary
                letterSpacing: -1,
              ),
            ),
            const SizedBox(height: 24),
            const CircularProgressIndicator(
              color: Color(0xFF1F3F34),
            ),
          ],
        ),
      ),
    );
  }
}
