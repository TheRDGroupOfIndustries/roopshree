import cron from "node-cron";
import { deleteExpiredOtps } from "./otpCleanup";

// run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  await deleteExpiredOtps();
});
