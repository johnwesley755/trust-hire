import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/api_client.dart';

final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(
    onSessionExpired: () {
      ref.read(sessionExpiredProvider.notifier).state = true;
    },
  );
});

// State provider to track global session expiration
final sessionExpiredProvider = StateProvider<bool>((ref) => false);
