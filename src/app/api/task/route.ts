import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import validator from "validator";
import { db } from "@/lib/db";
const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
});

export async function POST(request: NextRequest, response: NextResponse) {
  const body = await request.json();
  const { name } = schema.parse(body);

  const newPost = await db.task.create({
    data: {
      name,
    },
  });

  return NextResponse.json(newPost);
}

export async function GET(request: NextRequest, response: NextResponse) {
  const posts = await db.task.findMany();
  return NextResponse.json(posts);
}

export async function DELETE(request: NextRequest, response: NextResponse) {
  const { id } = await request.json();

  const deletePost = await db.task.delete({
    where: {
      id,
    },
  });
  return NextResponse.json({
    message: "Task deleted successfully",
    deletePost,
  });
}

export async function PUT(request: NextRequest, response: NextResponse) {
  const body = await request.json();
  const { name } = schema.parse(body);
  const { id } = body;
  const updatePost = await db.task.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
  return NextResponse.json(updatePost);
}
