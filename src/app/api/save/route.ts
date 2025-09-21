// Fetch all tasks, sorted by deadline ascending
export async function GET() {
  await dbConnect();
  try {
    const tasks = await Planner.find({}).sort({ deadline: 1 });
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
  const { id, ...update } = await req.json();
  try {
    const updated = await Planner.findByIdAndUpdate(id, update, { new: true });
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
  const { id } = await req.json();
  try {
    await Planner.findByIdAndDelete(id);
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
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

// Use the 'planner' collection in the 'coins' database

const DataSchema = new mongoose.Schema(
  {
    name: String,
    value: String,
    deadline: Date,
    bought: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "planner" }
);

// Always use the model name 'Planner' to avoid model overwrite issues
const Planner =
  mongoose.models.Planner || mongoose.model("Planner", DataSchema);

export async function POST(req: NextRequest) {
  console.log("API /api/save called");
  try {
    await dbConnect();
    console.log("MongoDB connected");
    const body = await req.json();
    console.log("Request body:", body);
    // Save to the 'planner' collection in the 'coins' database
    const doc = await Planner.create(body);
    console.log("added successfully");
    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error("Error in /api/save:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
