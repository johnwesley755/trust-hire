import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});

  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> {
  final _subjectController = TextEditingController();
  final _messageController = TextEditingController();
  bool _isSubmitting = false;
  bool _isSuccess = false;

  final List<Map<String, String>> faqs = [
    {
      "question": "How do I increase my Worker Level?",
      "answer": "Your level increases based on your work experience, skill certifications, and consistently high ratings from employers. Completing more jobs successfully and passing skill tests are the fastest ways to level up."
    },
    {
      "question": "When do I get paid?",
      "answer": "Payments are typically processed 24-48 hours after the employer confirms the completion of a job. You can track your earnings in the dashboard."
    },
    {
      "question": "What should I do if an employer cancels a job?",
      "answer": "If a job is cancelled within 2 hours of the start time, you may be eligible for a cancellation fee. Contact support if you believe you are entitled to compensation."
    },
    {
      "question": "How do I verify my identity?",
      "answer": "Go to Profile > Verify Identity. You will need to upload a valid government ID and take a live selfie for verification."
    }
  ];

  Future<void> _submitTicket() async {
    if (_subjectController.text.isEmpty || _messageController.text.isEmpty) return;

    setState(() => _isSubmitting = true);
    // Simulate API call
    await Future.delayed(const Duration(seconds: 2));
    setState(() {
      _isSubmitting = false;
      _isSuccess = true;
      _subjectController.clear();
      _messageController.clear();
    });
  }

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
              child: const Center(
                child: Column(
                  children: [
                    Text(
                      'Support Center',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF1F3F34),
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'How can we help you today? Search our FAQs or contact our dedicated support team.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF1F3F34),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 40),
            
            FadeInUp(
              delay: const Duration(milliseconds: 200),
              child: const Row(
                children: [
                  Icon(LucideIcons.helpCircle, color: Color(0xFFFACD15)),
                  SizedBox(width: 8),
                  Text(
                    'Frequently Asked Questions',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF1F3F34),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            ...faqs.asMap().entries.map((entry) {
              return FadeInUp(
                delay: Duration(milliseconds: 300 + (entry.key * 100)),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.black.withOpacity(0.05)),
                  ),
                  child: Theme(
                    data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                    child: ExpansionTile(
                      iconColor: const Color(0xFF1F3F34),
                      collapsedIconColor: const Color(0xFF1F3F34),
                      title: Text(
                        entry.value['question']!,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1F3F34),
                          fontSize: 14,
                        ),
                      ),
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                          child: Text(
                            entry.value['answer']!,
                            style: TextStyle(
                              color: const Color(0xFF1F3F34).withOpacity(0.7),
                              fontSize: 13,
                              height: 1.5,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }).toList(),
            
            const SizedBox(height: 40),
            
            // Contact Support Card
            FadeInUp(
              delay: const Duration(milliseconds: 700),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFF1F3F34),
                  borderRadius: BorderRadius.circular(32),
                ),
                child: _isSuccess ? _buildSuccessState() : _buildContactForm(),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildContactForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Contact Support',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 24),
        const Text('SUBJECT', style: TextStyle(color: Colors.white54, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
        const SizedBox(height: 8),
        TextField(
          controller: _subjectController,
          style: const TextStyle(color: Colors.white, fontSize: 14),
          decoration: InputDecoration(
            hintText: "What's the issue?",
            hintStyle: const TextStyle(color: Colors.white30),
            filled: true,
            fillColor: Colors.white.withOpacity(0.05),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
        const SizedBox(height: 16),
        const Text('MESSAGE', style: TextStyle(color: Colors.white54, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
        const SizedBox(height: 8),
        TextField(
          controller: _messageController,
          maxLines: 4,
          style: const TextStyle(color: Colors.white, fontSize: 14),
          decoration: InputDecoration(
            hintText: "Describe your problem in detail...",
            hintStyle: const TextStyle(color: Colors.white30),
            filled: true,
            fillColor: Colors.white.withOpacity(0.05),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _isSubmitting ? null : _submitTicket,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFACD15),
              foregroundColor: const Color(0xFF1F3F34),
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 0,
            ),
            child: _isSubmitting
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF1F3F34)))
                : const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(LucideIcons.send, size: 18),
                      SizedBox(width: 8),
                      Text('Submit Ticket', style: TextStyle(fontWeight: FontWeight.w900)),
                    ],
                  ),
          ),
        ),
        const SizedBox(height: 32),
        const Divider(color: Colors.white10),
        const SizedBox(height: 16),
        const Row(
          children: [
            Icon(LucideIcons.mail, color: Color(0xFFFACD15), size: 16),
            SizedBox(width: 12),
            Text('support@trusthire.com', style: TextStyle(color: Colors.white, fontSize: 12)),
          ],
        ),
        const SizedBox(height: 12),
        const Row(
          children: [
            Icon(LucideIcons.phone, color: Color(0xFFFACD15), size: 16),
            SizedBox(width: 12),
            Text('+91 1800-TRUST-HIRE', style: TextStyle(color: Colors.white, fontSize: 12)),
          ],
        ),
      ],
    );
  }

  Widget _buildSuccessState() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 32),
      child: Column(
        children: [
          const Icon(LucideIcons.checkCircle2, color: Color(0xFFFACD15), size: 64),
          const SizedBox(height: 16),
          const Text('Message Sent!', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text('Our team will get back to you within 24 hours.', textAlign: TextAlign.center, style: TextStyle(color: Colors.white70, fontSize: 14)),
          const SizedBox(height: 24),
          TextButton(
            onPressed: () => setState(() => _isSuccess = false),
            child: const Text('Send another message', style: TextStyle(color: Color(0xFFFACD15), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
