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
    if (authState.isAuthenticated) {
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
