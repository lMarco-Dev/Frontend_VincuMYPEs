import api from "@shared/api/httpClient";

export const authRecoveryApi = {
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  verifyOtp: (email, otp) => api.post("/auth/verify-otp", { email, otp }),
  resetPassword: (token, newPassword) => api.post("/auth/reset-password", { token, newPassword }),
  
  sendVerificationOtp: (email) => api.post(`/auth/verify-email?email=${encodeURIComponent(email)}`),
  confirmVerificationOtp: (email, otp) => api.post(`/auth/confirm-email?email=${encodeURIComponent(email)}&otp=${otp}`),
};