import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authenticate } from "@/lib/auth";

export const GET = authenticate(async (req) => {
  try {
    const { db } = await connectToDatabase();
    const tasks = await db
      .collection("tasks")
      .find({ userId: new ObjectId(req.user.userId) })
      .toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching tasks", error: error.message },
      { status: 500 }
    );
  }
});

export const POST = authenticate(async (req) => {
  try {
    const { db } = await connectToDatabase();
    const taskData = await req.json();
    const newTask = {
      ...taskData,
      userId: new ObjectId(req.user.userId),
      createdAt: new Date(),
    };

    const result = await db.collection("tasks").insertOne(newTask);
    const insertedTask = await db
      .collection("tasks")
      .findOne({ _id: result.insertedId });

    return NextResponse.json(insertedTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating task", error: error.message },
      { status: 500 }
    );
  }
});
