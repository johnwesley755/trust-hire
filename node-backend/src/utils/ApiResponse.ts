export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(message: string | T, data?: T) {
    if (typeof message === 'string') {
        return new ApiResponse(true, message, data);
    }
    return new ApiResponse(true, 'Success', message);
  }

  static error(message: string) {
    return new ApiResponse(false, message);
  }
}
