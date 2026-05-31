import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'dart:ui';
import '../../../../core/theme/app_colors.dart';
import 'sign_in_screen.dart';

class RoleSelectionScreen extends StatelessWidget {
  const RoleSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F4EF),
      body: Stack(
        children: [
          // Background blobs
          Positioned(
            top: -50,
            right: -100,
            child: FadeInDown(
              duration: const Duration(seconds: 2),
              child: ImageFiltered(
                imageFilter: ImageFilter.blur(sigmaX: 60, sigmaY: 60),
                child: Container(
                  width: 300,
                  height: 300,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFACD15).withOpacity(0.15),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(150),
                      topRight: Radius.circular(200),
                      bottomLeft: Radius.circular(210),
                      bottomRight: Radius.circular(150),
                    ),
                  ),
                ),
              ),
            ),
          ),
          
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 40),
                  FadeInLeft(
                    child: const Text(
                      'Welcome to\nTrustHire.',
                      style: TextStyle(
                        fontFamily: 'Epilogue',
                        fontSize: 40,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF1F3F34),
                        height: 1.1,
                        letterSpacing: -1.0,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  FadeInLeft(
                    delay: const Duration(milliseconds: 200),
                    child: Text(
                      'How do you want to use\nthe platform today?',
                      style: TextStyle(
                        fontFamily: 'Be Vietnam Pro',
                        fontSize: 16,
                        color: const Color(0xFF1F3F34).withOpacity(0.6),
                        fontWeight: FontWeight.w600,
                        height: 1.5,
                      ),
                    ),
                  ),
                  const Spacer(),
                  
                  // Role Cards
                  _RoleCard(
                    title: 'I want to Work',
                    subtitle: 'Find verified jobs and build your professional profile.',
                    icon: LucideIcons.briefcase,
                    delay: 400,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SignInScreen(role: 'WORKER')),
                      );
                    },
                  ),
                  const SizedBox(height: 20),
                  _RoleCard(
                    title: 'I want to Hire',
                    subtitle: 'Post jobs and connect with trusted talent across Bharat.',
                    icon: LucideIcons.users,
                    delay: 600,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SignInScreen(role: 'EMPLOYER')),
                      );
                    },
                  ),
                  
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final int delay;
  final VoidCallback onTap;

  const _RoleCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.delay,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return FadeInUp(
      delay: Duration(milliseconds: delay),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(32),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF1F3F34).withOpacity(0.04),
                blurRadius: 30,
                offset: const Offset(0, 10),
              ),
            ],
            border: Border.all(color: Colors.transparent),
          ),
          child: Row(
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: const Color(0xFFFAF6E3),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Icon(icon, color: const Color(0xFF1F3F34), size: 28),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontFamily: 'Epilogue',
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF1F3F34),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontFamily: 'Be Vietnam Pro',
                        fontSize: 12,
                        color: const Color(0xFF1F3F34).withOpacity(0.5),
                        fontWeight: FontWeight.w500,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(LucideIcons.chevronRight, color: const Color(0xFF1F3F34).withOpacity(0.4)),
            ],
          ),
        ),
      ),
    );
  }
}
