/**
 * POST /api/payments/initiate
 *
 * Initiates enrollment for a workshop.
 * - Free workshops: creates Enrollment directly, sends email, returns redirect.
 * - Paid workshops: creates Razorpay order, returns order data to client.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/db/connect";
import WorkshopModel from "@/lib/db/models/Workshop";
import PaymentModel from "@/lib/db/models/Payment";
import EnrollmentModel from "@/lib/db/models/Enrollment";
import { User } from "@/lib/db/models/User";
import {
  sendEnrollmentConfirmation,
  workshopDocToEmailData,
} from "@/lib/email/sendEnrollmentConfirmation";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
    const parentId = (session.user as { id?: string }).id!;

    // ── Body ──────────────────────────────────────────────────────────────────
    const body = await req.json();
    const { workshopId } = body as { workshopId?: string };
    if (!workshopId) {
      return NextResponse.json(
        { error: "workshopId is required" },
        { status: 400 },
      );
    }

    await connectDB();

    // ── Workshop ──────────────────────────────────────────────────────────────
    const workshop = await WorkshopModel.findById(workshopId).lean();
    if (!workshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 },
      );
    }

    // ── Enrollment open check ─────────────────────────────────────────────────
    if (!workshop.isEnrollmentOpen) {
      return NextResponse.json(
        { error: "Enrollment for this workshop is currently closed." },
        { status: 403 },
      );
    }

    // ── Duplicate check ───────────────────────────────────────────────────────
    const existing = await EnrollmentModel.findOne({
      parentId: new mongoose.Types.ObjectId(parentId),
      workshopId: new mongoose.Types.ObjectId(workshopId),
    });
    if (existing) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    }

    // ── Fetch parent info for email ───────────────────────────────────────────
    const parentDoc = await User.findById(parentId).select("name email").lean();
    if (!parentDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const workshopForEmail = workshopDocToEmailData(workshop);

    // ── FREE workshop ─────────────────────────────────────────────────────────
    if (workshop.isFree) {
      const enrollment = await EnrollmentModel.create({
        parentId: new mongoose.Types.ObjectId(parentId),
        workshopId: new mongoose.Types.ObjectId(workshopId),
        status: "confirmed",
        amountPaid: 0,
        enrolledAt: new Date(),
      });

      // Increment enrolled count
      await WorkshopModel.findByIdAndUpdate(workshopId, {
        $inc: { enrolledCount: 1 },
      });

      // Send confirmation email (non-blocking — don't fail enrollment if email fails)
      sendEnrollmentConfirmation({
        parentEmail: parentDoc.email,
        parentName: parentDoc.name,
        bookingId: enrollment._id.toString(),
        workshop: workshopForEmail,
        amountPaid: 0,
      }).catch((err) =>
        console.error("[Email] Failed to send confirmation:", err),
      );

      return NextResponse.json({
        success: true,
        free: true,
        redirect: "/parent/dashboard?tab=workshops&enrolled=true",
        enrollmentId: enrollment._id.toString(),
      });
    }

    // ── PAID workshop — create Razorpay order ─────────────────────────────────
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          error:
            "Razorpay payment keys are not configured in server environment.",
        },
        { status: 501 },
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amountInPaise = Math.round((workshop.price ?? 0) * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `GOKIDS_${Date.now()}_${parentId.slice(-6)}`,
      notes: {
        workshopId: workshopId,
        workshopTitle: workshop.title,
        parentId: parentId,
      },
    });

    // Persist payment record
    await PaymentModel.create({
      parentId: new mongoose.Types.ObjectId(parentId),
      workshopId: new mongoose.Types.ObjectId(workshopId),
      razorpayOrderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      status: "initiated",
    });

    return NextResponse.json({
      success: true,
      free: false,
      order: {
        id: order.id,
        amount: amountInPaise,
        currency: "INR",
      },
      keyId: process.env.RAZORPAY_KEY_ID,
      prefill: {
        name: parentDoc.name,
        email: parentDoc.email,
      },
      workshopTitle: workshop.title,
    });
  } catch (err: any) {
    console.error("[POST /api/payments/initiate]", err);
    const errorMessage = err?.error?.description || err?.message || "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: err?.statusCode || 500 }
    );
  }
}
