/**
 * Payment Creation API Endpoint
 * POST /api/payments/create-order
 */

import { NextRequest } from "next/server";
import { PaymentModel, CourseModel } from "@/lib/models";
import Razorpay from "razorpay";
import {
  successResponse,
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
} from "@/lib/api-responses";
import { connectDB } from "@/lib/mongodb";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { courseId, email, phone, name } = body;

    if (!courseId || !email || !name) {
      return badRequestResponse("Course ID, email, and name are required");
    }

    // Find course
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return notFoundResponse("Course");
    }

    // Create Razorpay order
    const amount = Math.round(course.price * 100); // Convert to paise

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        courseId: courseId,
        email,
        name,
      },
    });

    // Save payment record
    const payment = new PaymentModel({
      orderId: razorpayOrder.id,
      amount,
      currency: "INR",
      status: "created",
      customerEmail: email,
      customerPhone: phone,
      customerName: name,
      itemType: "course",
      itemId: courseId,
      itemName: course.title,
    });

    await payment.save();

    return successResponse(
      {
        orderId: razorpayOrder.id,
        amount,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
        paymentId: payment._id,
      },
      "Order created successfully",
      201
    );
  } catch (error) {
    console.error("Payment creation error:", error);
    return internalErrorResponse("Failed to create payment order", error);
  }
}
