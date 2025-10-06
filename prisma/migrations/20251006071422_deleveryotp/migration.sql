-- AlterEnum
ALTER TYPE "public"."Status" ADD VALUE 'DELIVERED';

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "deliveryBoyId" TEXT;

-- CreateTable
CREATE TABLE "public"."OrderOtp" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "OrderOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderOtp_orderId_key" ON "public"."OrderOtp"("orderId");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_deliveryBoyId_fkey" FOREIGN KEY ("deliveryBoyId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderOtp" ADD CONSTRAINT "OrderOtp_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
