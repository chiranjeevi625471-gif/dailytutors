/**
 * Payment Verification API Endpoint
 * POST /api/payments/verify
 */

import { NextRequest } from "next/server";
import { PaymentModel } from "@/lib/models";
import crypto from "crypto";
import {
  successResponse,
  badRequestResponse,
  internalErrorResponse,
} from "@/lib/api-responses";
import { connectDB } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { orderId, paymentId, signature } = body;

    if (!orderId || !paymentId || !signature) {
      return badRequestResponse("Order ID, Payment ID, and Signature are required");
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return badRequestResponse("Payment verification failed - Invalid signature");
    }

    // Update payment record
    const payment = await PaymentModel.findOneAndUpdate(
      { orderId },
      {
        paymentId,
        status: "captured",
        signature,
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!payment) {
      return badRequestResponse("Payment record not found");
    }

    // Here you can add logic to:
    // 1. Create enrollment for student (future use)
    // 2. Send confirmation email
    // 3. Update course statistics
    // 4. Generate invoice

    return successResponse(
      {
        payment: {
          _id: payment._id,
          orderId: payment.orderId,
          paymentId: payment.paymentId,
          status: payment.status,
          amount: payment.amount,
          itemName: payment.itemName,
        },
        message: "Payment verified successfully",
      },
      "Payment successful"
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return internalErrorResponse("Payment verification failed", error);
  }
}
