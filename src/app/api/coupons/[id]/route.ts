// src/app/api/coupons/[id]/route.tsx
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateCouponSchema = z.object({
  storeName: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  discount: z.string().min(1).optional(),
  link: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

const MOCK_USER_ID = "clerk_user_id_mock_1";

interface Context {
  params: {
    id: string;
  };
}

export async function DELETE(request: Request, context: Context) {
  try {
    const { id } = context.params;

    const coupon = await prisma.coupon.findUnique({
      where: { id, userId: MOCK_USER_ID },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Cupom não encontrado ou permissão negada" },
        { status: 404 }
      );
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Cupom removido com sucesso" });
  } catch (error) {
    console.error("[COUPON_DELETE]", error);
    return NextResponse.json(
      { error: "Erro interno ao deletar" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = context.params;
    const body = await request.json();

    const validation = updateCouponSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existingCoupon = await prisma.coupon.findUnique({
      where: { id, userId: MOCK_USER_ID },
    });

    if (!existingCoupon) {
      return NextResponse.json(
        { error: "Cupom não encontrado" },
        { status: 404 }
      );
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...validation.data,
        link: validation.data.link === "" ? null : validation.data.link,
      },
    });

    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.error("[COUPON_UPDATE]", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar" },
      { status: 500 }
    );
  }
}