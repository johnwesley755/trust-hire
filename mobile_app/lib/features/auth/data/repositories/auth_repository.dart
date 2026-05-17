import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/api/api_client.dart';
import '../../../../core/api/endpoints.dart';

class AuthRepository {
  final ApiClient _api;

  AuthRepository(this._api);

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _api.dio.post(
      Endpoints.login,
      data: {'email': email, 'password': password},
    );
    return response.data;
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> data) async {
    final response = await _api.dio.post(Endpoints.register, data: data);
    return response.data;
  }

  Future<void> sendOtp(String email) async {
    await _api.dio.post(Endpoints.sendOtp, data: {'email': email});
  }

  Future<String> uploadMedia(XFile file) async {
    final bytes = await file.readAsBytes();
    final formData = FormData.fromMap({
      'file': MultipartFile.fromBytes(
        bytes,
        filename: file.name,
      ),
    });
    final response = await _api.dio.post(Endpoints.mediaUpload, data: formData);
    return response.data['data']['url'];
  }

  Future<Map<String, dynamic>> sync(String role) async {
    final response = await _api.dio.post(Endpoints.sync, data: {'role': role});
    return response.data;
  }

  Future<Map<String, dynamic>> getCurrentUser() async {
    final response = await _api.dio.get(Endpoints.me);
    return response.data;
  }
}
