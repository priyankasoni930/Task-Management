import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    const body = await req.json();

    console.log("Updating task:", id);
    console.log("Update body:", body);

    if (
      body.status &&
      !["To Do", "In Progress", "Completed"].includes(body.status)
    ) {
      console.log("Invalid status:", body.status);
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await db
      .collection("tasks")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: body },
        { returnDocument: "after" }
      );

    if (!result) {
      console.log("Task not found:", id);
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    console.log("Task updated successfully:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;

    console.log("Deleting task:", id);

    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(id),
    });

    console.log("Delete result:", result);

    if (result.deletedCount === 0) {
      console.log("Task not found:", id);
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    console.log("Task deleted successfully");
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
