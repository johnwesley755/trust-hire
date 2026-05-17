import 'package:flutter/material.dart';

class AppColors {
  // Brand Colors
  static const Color primary = Color(0xFF1F3F34);    // Premium Dark Green
  static const Color accent = Color(0xFFFACD15);     // Signal Yellow
  static const Color background = Color(0xFFF5F4EF); // Cream Background
  static const Color surface = Colors.white;
  
  // Secondary / UI Colors
  static const Color textPrimary = Color(0xFF1F3F34);
  static const Color textSecondary = Color(0x991F3F34); // 60% Opacity
  static const Color textTertiary = Color(0x661F3F34);  // 40% Opacity
  
  static const Color border = Color(0xFFE9E8E3);
  static const Color inputBg = Color(0xFFE9E8E3);
  
  // Status Colors
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  
  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF1F3F34), Color(0xFF456559)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
