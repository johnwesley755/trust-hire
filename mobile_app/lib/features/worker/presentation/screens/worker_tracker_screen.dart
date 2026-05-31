import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:animate_do/animate_do.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../providers/worker_dashboard_provider.dart';
import '../../../shared/presentation/screens/notification_screen.dart';
import '../../../shared/presentation/providers/notification_provider.dart';
import '../../../shared/presentation/widgets/trust_hire_header.dart';
import '../../../jobs/presentation/screens/job_details_screen.dart';
import '../../../help/presentation/screens/help_screen.dart';

class WorkerTrackerScreen extends ConsumerStatefulWidget {
  const WorkerTrackerScreen({super.key});

  @override
  ConsumerState<WorkerTrackerScreen> createState() => _WorkerTrackerScreenState();
}

class _WorkerTrackerScreenState extends ConsumerState<WorkerTrackerScreen> {

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(workerDashboardProvider.notifier).refreshDashboard();
      ref.read(notificationProvider.notifier).refreshNotifications();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);
    final dashboardState = ref.watch(workerDashboardProvider);
    final notificationState = ref.watch(notificationProvider);

    final firstName = auth.user?['first_name'] ?? 'Habib';
    
    final appliedJobs = dashboardState.stats['appliedJobs']?.toString() ?? '0';
    final trustScore = dashboardState.stats['trustScore']?.toString() ?? '0.0';
    final level = dashboardState.stats['level']?.toString() ?? 'L1';
    final unreadNotifications = notificationState.unreadCount.toString();
    final profileImageUrl = auth.user?['profile_image_url'] as String?;

    return RefreshIndicator(
      onRefresh: () async {
        await Future.wait([
          ref.read(workerDashboardProvider.notifier).refreshDashboard(),
          ref.read(notificationProvider.notifier).refreshNotifications(),
        ]);
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            FadeInDown(
              child: const TrustHireHeader(),
            ),
            const SizedBox(height: 32),
            
            // Stats Grid
            if (dashboardState.isLoading)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(24.0),
                  child: CircularProgressIndicator(),
                ),
              )
            else
              Column(
                children: [
                  Row(
                    children: [
                      // Card 1: Applied
                      Expanded(
                        child: FadeInUp(
                          delay: const Duration(milliseconds: 100),
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(24),
                              boxShadow: [
                                BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Icon(LucideIcons.send, color: Color(0xFF1F3F34)),
                                    Text('LAST 30D', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF1F3F34).withOpacity(0.4))),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                Text(appliedJobs, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, height: 1)),
                                const SizedBox(height: 4),
                                Text('Jobs Applied'.toUpperCase(), style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF1F3F34).withOpacity(0.6), letterSpacing: 1)),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Card 2: Level
                      Expanded(
                        child: FadeInUp(
                          delay: const Duration(milliseconds: 200),
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: const Color(0xFF1F3F34), // deep green
                              borderRadius: BorderRadius.circular(24),
                              boxShadow: [
                                BoxShadow(color: const Color(0xFF1F3F34).withOpacity(0.2), blurRadius: 10, offset: const Offset(0, 4)),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Icon(LucideIcons.award, color: Color(0xFFFACD15)),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: const Text('ACTIVE', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 1)),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                Text(level, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white, height: 1)),
                                const SizedBox(height: 4),
                                Text('Entry Specialist'.toUpperCase(), style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white.withOpacity(0.7), letterSpacing: 1)),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      // Card 3: Notifs
                      Expanded(
                        child: FadeInUp(
                          delay: const Duration(milliseconds: 300),
                          child: GestureDetector(
                            onTap: () {
                              Navigator.push(context, MaterialPageRoute(builder: (context) => const NotificationScreen()));
                            },
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(24),
                                boxShadow: [
                                  BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Icon(LucideIcons.mailWarning, color: Color(0xFFba1a1a)),
                                  const SizedBox(height: 16),
                                  Text(unreadNotifications, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Color(0xFFba1a1a), height: 1)),
                                  const SizedBox(height: 4),
                                  Text('Unread Alerts'.toUpperCase(), style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF1F3F34).withOpacity(0.6), letterSpacing: 1)),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Card 4: Trust Score
                      Expanded(
                        child: FadeInUp(
                          delay: const Duration(milliseconds: 400),
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(24),
                              boxShadow: [
                                BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
                              ],
                            ),
                            child: Stack(
                              children: [
                                Positioned.fill(
                                  child: Container(
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFACD15).withOpacity(0.05),
                                      borderRadius: BorderRadius.circular(24),
                                    ),
                                  ),
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Icon(LucideIcons.shieldCheck, color: Color(0xFFFACD15)),
                                    const SizedBox(height: 16),
                                    Row(
                                      crossAxisAlignment: CrossAxisAlignment.baseline,
                                      textBaseline: TextBaseline.alphabetic,
                                      children: [
                                        Text(trustScore.toString(), style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, height: 1, color: Color(0xFF1F3F34))),
                                        const SizedBox(width: 2),
                                        const Text('%', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF1F3F34))),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text('Trust Score'.toUpperCase(), style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF1F3F34).withOpacity(0.6), letterSpacing: 1)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            
            const SizedBox(height: 32),
            FadeInUp(
              delay: const Duration(milliseconds: 500),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text(
                    'Recent Activity',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF1F3F34),
                      letterSpacing: -0.5,
                    ),
                  ),
                  Text(
                    'VIEW ALL',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                      color: const Color(0xFF1F3F34).withOpacity(0.5),
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 16),
            if (dashboardState.applications.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 24.0),
                  child: Text('No recent activity yet.'),
                ),
              )
            else
              ...dashboardState.applications.take(2).map((app) {
                final job = app['job'] as Map<String, dynamic>? ?? {};
                final jobTitle = job['title'] ?? 'Job';
                final jobCompany = job['companyName'] ?? 'TrustHire Partner';
                final status = app['status'] ?? 'PENDING';
                final jobId = job['id'] as String?;
                return _ActivityItem(
                  jobId: jobId,
                  status: status,
                  title: jobTitle,
                  company: jobCompany,
                  time: 'Recently',
                  delay: 600,
                );
              }).toList(),
            
            const SizedBox(height: 24),
            // Need Help Visual Break
            FadeInUp(
              delay: const Duration(milliseconds: 700),
              child: Container(
                height: 192,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 20, offset: const Offset(0, 10)),
                  ],
                ),
                clipBehavior: Clip.antiAlias,
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: Image.network(
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuBcPtw5d1r057NycdQPVUN0AkMn7ymejOKC0xbcA62p_3s0ua8hwNc2tS5Lz6ARuzLc5n8TBbcxJNJWe5h-rV6L9j-ys-qlgJ-W2kFQCt66pby7bGAxA74Uw90r9RGzqDhNkDMu4cayGvZ9yVA7erQ45FlwAIQ4AEn3a3HfbblojYX3nX1SdL7cfGnMfJYA9nq9SAQfU8WHYFaGgEo6udhDxSwm2rumvUzPm1P7A5U_7cUQQkQbvT4T-pgSRsgXB-d5ZwM1JxCNi0w',
                        fit: BoxFit.cover,
                      ),
                    ),
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                            colors: [
                              const Color(0xFF1F3F34),
                              const Color(0xFF1F3F34).withOpacity(0.4),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 24,
                      left: 24,
                      right: 24,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Need Help?', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
                          const SizedBox(height: 4),
                          Text('Contact your dedicated career coach for interview tips.', style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 12, fontWeight: FontWeight.w500)),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => const HelpScreen()),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFFACD15),
                              foregroundColor: const Color(0xFF1F3F34),
                              elevation: 0,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            ),
                            child: const Text('GET GUIDANCE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActivityItem extends StatelessWidget {
  final String? jobId;
  final String title;
  final String company;
  final String status;
  final String time;
  final int delay;

  const _ActivityItem({
    this.jobId,
    required this.title,
    required this.company,
    required this.status,
    required this.time,
    required this.delay,
  });

  @override
  Widget build(BuildContext context) {
    final isAccepted = status.toUpperCase() == 'ACCEPTED';
    
    return FadeInUp(
      delay: Duration(milliseconds: delay),
      child: GestureDetector(
        onTap: () {
          if (jobId != null) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => JobDetailsScreen(jobId: jobId!)),
            );
          }
        },
        child: Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border(
            left: BorderSide(
              color: isAccepted ? const Color(0xFFFACD15) : Colors.transparent,
              width: 4,
            ),
          ),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: isAccepted ? const Color(0xFFFACD15) : const Color(0xFFE9E8E3),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          status.toUpperCase(),
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: isAccepted ? const Color(0xFF002117) : const Color(0xFF1F3F34).withOpacity(0.6),
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text('• $time', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF1F3F34).withOpacity(0.4))),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Color(0xFF1F3F34)),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    company,
                    style: TextStyle(color: const Color(0xFF1F3F34).withOpacity(0.6), fontSize: 12, fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ),
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: const Color(0xFFE9E8E3),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                isAccepted ? LucideIcons.hammer : LucideIcons.shield,
                color: const Color(0xFF1F3F34),
                size: 24,
              ),
            ),
          ],
        ),
      ),
      ),
    );
  }
}
