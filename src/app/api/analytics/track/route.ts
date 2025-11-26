import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, type } = body;

    if (!id || !type) {
      return new NextResponse("Missing data", { status: 400 });
    }

    let userId = "";

    if (type === "product") {
      const item = await prisma.product.findUnique({ where: { id }, select: { userId: true } });
      if (item) userId = item.userId;
    } else if (type === "coupon") {
      const item = await prisma.coupon.findUnique({ where: { id }, select: { userId: true } });
      if (item) userId = item.userId;
    } else if (type === "partner") {
      const item = await prisma.partner.findUnique({ where: { id }, select: { userId: true } });
      if (item) userId = item.userId;
    }

    if (!userId) {
      return new NextResponse("Item not found", { status: 404 });
    }

    await prisma.analyticsLog.create({
      data: {
        itemId: id,
        type,
        userId,
      }
    });

    if (type === "product") {
      await prisma.product.update({ where: { id }, data: { clicks: { increment: 1 } } });
    } else if (type === "coupon") {
      await prisma.coupon.update({ where: { id }, data: { clicks: { increment: 1 } } });
    } else if (type === "partner") {
      await prisma.partner.update({ where: { id }, data: { clicks: { increment: 1 } } });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[ANALYTICS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}