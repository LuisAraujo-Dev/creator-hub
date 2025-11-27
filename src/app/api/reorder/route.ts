import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { list, type } = body; 

    if (!["product", "coupon", "partner"].includes(type)) {
      return new NextResponse("Invalid type", { status: 400 });
    }

    const transaction = list.map((item: { id: string; position: number }) => {
      // @ts-ignore - Prisma dynamic access
      return prisma[type].update({
        where: { id: item.id, userId }, 
        data: { order: item.position },
      });
    });

    await prisma.$transaction(transaction);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REORDER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}