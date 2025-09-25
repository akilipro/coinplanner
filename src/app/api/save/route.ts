import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const DataSchema = new mongoose.Schema(
  {
    name: String,
    value: String,
    deadline: Date,
    bought: { type: Boolean, default: false },
    userId: { type: String, required: true },
    userEmail: { type: String },
  },
  { timestamps: true, collection: "planner" }
);

const Planner =
  mongoose.models.Planner || mongoose.model("Planner", DataSchema);

// Fetch all tasks for the authenticated user
export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const tasks = await Planner.find({ userId: session.user.id }).sort({
      deadline: 1,
    });
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Update a task by id (PATCH)
export async function PATCH(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  const { _id, ...update } = await req.json();
  try {
    // Only update if the task belongs to the user
    const updated = await Planner.findOneAndUpdate(
      { _id, userId: session.user.id },
      update,
      { new: true }
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Delete a task by id (DELETE)
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  const { _id } = await req.json();
  try {
    // Only delete if the task belongs to the user
    await Planner.findOneAndDelete({ _id, userId: session.user.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Create a new task for the authenticated user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    await dbConnect();
    const body = await req.json();
    // Attach user info to the task
    const doc = await Planner.create({
      ...body,
      userId: session.user.id,
      userEmail: session.user.email,
    });
    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error("POST /api/save error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
