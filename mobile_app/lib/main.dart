import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:trust_hire/core/theme/app_theme.dart';
import 'package:trust_hire/features/auth/presentation/providers/auth_provider.dart';
import 'package:trust_hire/features/auth/presentation/screens/role_selection_screen.dart';
import 'package:trust_hire/features/shared/presentation/screens/main_shell.dart';
import 'package:trust_hire/features/shared/presentation/widgets/session_expired_overlay.dart';

import 'package:trust_hire/features/profile/presentation/screens/onboarding_screen.dart';

import 'package:animate_do/animate_do.dart';

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
      home: SplashGate(
        isAuthLoading: authState.isLoading,
        child: home,
      ),
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

class SplashGate extends StatefulWidget {
  final Widget child;
  final bool isAuthLoading;

  const SplashGate({
    super.key,
    required this.child,
    required this.isAuthLoading,
  });

  @override
  State<SplashGate> createState() => _SplashGateState();
}

class _SplashGateState extends State<SplashGate> {
  bool _splashCompleted = false;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() async {
    await Future.delayed(const Duration(milliseconds: 2500));
    if (mounted) {
      setState(() {
        _splashCompleted = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final showContent = _splashCompleted && !widget.isAuthLoading;

    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 600),
      switchInCurve: Curves.easeInOut,
      switchOutCurve: Curves.easeInOut,
      child: showContent
          ? widget.child
          : const SplashScreen(),
    );
  }
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1F3F34), // Forest Green brand background
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElasticIn(
              duration: const Duration(milliseconds: 1500),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(32),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Image.asset(
                  'assets/images/logo.png',
                  height: 100,
                  width: 100,
                  fit: BoxFit.contain,
                ),
              ),
            ),
            const SizedBox(height: 32),
            FadeInUp(
              duration: const Duration(milliseconds: 1000),
              child: const Text(
                'TrustHire',
                style: TextStyle(
                  fontSize: 44,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                  letterSpacing: -1.5,
                ),
              ),
            ),
            const SizedBox(height: 8),
            FadeInUp(
              delay: const Duration(milliseconds: 300),
              duration: const Duration(milliseconds: 1000),
              child: Text(
                'Human-First Recruitment Network',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.white.withOpacity(0.7),
                  letterSpacing: 0.5,
                ),
              ),
            ),
            const SizedBox(height: 48),
            ZoomIn(
              delay: const Duration(milliseconds: 600),
              child: const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  color: Color(0xFFFACD15),
                  strokeWidth: 2.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
