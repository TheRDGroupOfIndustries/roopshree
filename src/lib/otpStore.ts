// src/lib/otpStore.ts
type OtpRecord = { otp: string; expiresAt: number };

const otpStore = new Map<string, OtpRecord>();

export function saveOtp(email: string, otp: string) {
  otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // 10 minutes
}

export function verifyOtp(email: string, otp: string): boolean {
  const record = otpStore.get(email);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return false;
  }
  const isValid = record.otp === otp;
  if (isValid) otpStore.delete(email); // consume OTP after use
  return isValid;
}
