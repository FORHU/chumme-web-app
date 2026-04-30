import { ApiResponse } from "apisauce";

export interface StandardResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export type ApiResult<T> = ApiResponse<
  StandardResponse<T>,
  StandardResponse<null>
>;

export interface ApiEnvelope<T> {
  message?: string;
  data: T;
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  onboardingCompleted: boolean;
  artistCount?: number;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface VerificationRequiredResponse {
  requiresVerification: true;
  message: string;
  user: {
    email: string;
    isEmailVerified: false;
    otpExpiry: string;
  };
}

export interface RegisterRequest {
  email: string;
  username: string;
  displayName: string;
  password?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
