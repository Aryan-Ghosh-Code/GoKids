/**
 * POST /api/payments/verify
 *
 * Called from the client after Razorpay's checkout modal closes successfully.
 * Verifies the payment signature, creates the Enrollment, increments enrolledCount,
 * and sends the confirmation email.
 *
 * Razorpay signature verification (HMAC-SHA256):
 *   signature = HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import crypto from "crypto";
import { connectDB } from "@/lib/db/connect";
import PaymentModel from "@/lib/db/models/Payment";
import EnrollmentModel from "@/lib/db/models/Enrollment";
import WorkshopModel from "@/lib/db/models/Workshop";
import { User } from "@/lib/db/models/User";
import {
  sendEnrollmentConfirmation,
  workshopDocToEmailData,
} from "@/lib/email/sendEnrollmentConfirmation";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
    const parentId = (session.user as { id?: string }).id!;

    const body = (await req.json()) as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // ── Verify Razorpay signature ─────────────────────────────────────────────
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    await connectDB();

    // ── Find the payment record ───────────────────────────────────────────────
    const payment = await PaymentModel.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 },
      );
    }

    // ── Idempotency: already processed? ──────────────────────────────────────
    if (payment.status === "success") {
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    // ── Update payment record ─────────────────────────────────────────────────
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "success";
    await payment.save();

    const workshopId = payment.workshopId.toString();

    // ── Prevent duplicate enrollment ──────────────────────────────────────────
    const alreadyEnrolled = await EnrollmentModel.findOne({
      parentId: new mongoose.Types.ObjectId(parentId),
      workshopId: payment.workshopId,
    });

    let enrollmentId: string | null = alreadyEnrolled?._id.toString() ?? null;

    if (!alreadyEnrolled) {
      const enrollment = await EnrollmentModel.create({
        parentId: new mongoose.Types.ObjectId(parentId),
        workshopId: payment.workshopId,
        paymentId: payment._id,
        status: "confirmed",
        amountPaid: Math.round(payment.amount / 100), // convert paise → INR
        enrolledAt: new Date(),
      });
      enrollmentId = enrollment._id.toString();

      // Increment enrolled count
      await WorkshopModel.findByIdAndUpdate(workshopId, {
        $inc: { enrolledCount: 1 },
      });

      // Fetch workshop + parent for email
      const [workshop, parentDoc] = await Promise.all([
        WorkshopModel.findById(workshopId).lean(),
        User.findById(parentId).select("name email").lean(),
      ]);

      if (workshop && parentDoc && enrollmentId) {
        sendEnrollmentConfirmation({
          parentEmail: parentDoc.email,
          parentName: parentDoc.name,
          bookingId: enrollmentId,
          workshop: workshopDocToEmailData(workshop),
          amountPaid: Math.round(payment.amount / 100),
          txnId: razorpay_payment_id,
        }).catch((err) =>
          console.error("[Email] Failed to send confirmation:", err),
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[POST /api/payments/verify]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
