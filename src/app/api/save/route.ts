// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
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
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (!session || !(session.user && (session.user as { id?: string }).id)) {
    return new NextResponse(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: corsHeaders }
    );
  }
  try {
    const tasks = await Planner.find({
      userId: (session.user as { id?: string }).id,
    }).sort({
      deadline: 1,
    });
    return new NextResponse(JSON.stringify({ success: true, data: tasks }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Update a task by id (PATCH)
export async function PATCH(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (!session || !(session.user && (session.user as { id?: string }).id)) {
    return new NextResponse(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: corsHeaders }
    );
  }
  const { _id, ...update } = await req.json();
  try {
    // Only update if the task belongs to the user
    const updated = await Planner.findOneAndUpdate(
      { _id, userId: (session.user as { id?: string }).id },
      update,
      { new: true }
    );
    return new NextResponse(JSON.stringify({ success: true, data: updated }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Delete a task by id (DELETE)
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (!session || !(session.user && (session.user as { id?: string }).id)) {
    return new NextResponse(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: corsHeaders }
    );
  }
  const { _id } = await req.json();
  try {
    // Only delete if the task belongs to the user
    await Planner.findOneAndDelete({
      _id,
      userId: (session.user as { id?: string }).id,
    });
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Create a new task for the authenticated user
export async function POST(req: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user && (session.user as { id?: string }).id)) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: corsHeaders }
      );
    }
    await dbConnect();
    const body = await req.json();
    // Attach user info to the task
    const doc = await Planner.create({
      ...body,
      userId: (session.user as { id?: string }).id,
      userEmail: session.user.email,
    });
    return new NextResponse(JSON.stringify({ success: true, data: doc }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("POST /api/save error:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
