import prisma from "./prisma";

export async function deleteExpiredOtps() {
  try {
    const now = new Date();
    const deleted = await prisma.orderOtp.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`Deleted ${deleted.count} expired OTP(s)`);
  } catch (err) {
    console.error("Error deleting expired OTPs:", err);
  }
}
