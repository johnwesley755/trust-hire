import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class GuidelinesScreen extends StatelessWidget {
  const GuidelinesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F4EF),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF1F3F34)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            FadeInDown(
              child: const Text(
                'TrustHire Guidelines',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF1F3F34),
                ),
              ),
            ),
            const SizedBox(height: 8),
            FadeInDown(
              delay: const Duration(milliseconds: 100),
              child: Text(
                'Please read and follow these community guidelines to ensure a safe and professional environment.',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF1F3F34).withOpacity(0.7),
                ),
              ),
            ),
            const SizedBox(height: 32),
            _buildGuidelineCard(
              delay: 200,
              icon: LucideIcons.shieldCheck,
              title: 'Professional Conduct',
              description: 'Maintain professionalism in all interactions. Discrimination, harassment, or abusive language will result in immediate account suspension.',
            ),
            _buildGuidelineCard(
              delay: 300,
              icon: LucideIcons.clock,
              title: 'Punctuality & Reliability',
              description: 'Arrive on time for accepted jobs. If you must cancel, provide at least 24 hours notice. Frequent cancellations may lower your Trust Score.',
            ),
            _buildGuidelineCard(
              delay: 400,
              icon: LucideIcons.checkSquare,
              title: 'Accurate Representation',
              description: 'Ensure your profile, skills, and certifications are accurate and up-to-date. Falsifying qualifications is strictly prohibited.',
            ),
            _buildGuidelineCard(
              delay: 500,
              icon: LucideIcons.messageSquare,
              title: 'Clear Communication',
              description: 'Keep employers updated on your progress. Respond to messages promptly and report any issues immediately.',
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildGuidelineCard({required int delay, required IconData icon, required String title, required String description}) {
    return FadeInUp(
      delay: Duration(milliseconds: delay),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFFACD15).withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: const Color(0xFF1F3F34), size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Color(0xFF1F3F34)),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    description,
                    style: TextStyle(color: const Color(0xFF1F3F34).withOpacity(0.7), fontSize: 13, height: 1.5),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
