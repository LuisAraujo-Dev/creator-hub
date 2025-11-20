import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import * as z from "zod";

const MOCK_USER_ID = "clerk_user_id_mock_1";

const couponSchema = z.object({
  storeName: z.string().min(2, "Nome da loja é obrigatório."),
  code: z.string().min(3, "O código deve ter pelo menos 3 caracteres."),
  discount: z.string().min(1, "O desconto é obrigatório."),
  link: z.string().url("A URL é inválida.").optional().or(z.literal("")).nullable(),
  active: z.boolean().default(true),
});

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error("[COUPONS_GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar cupons" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const validation = couponSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validation.data;

    const newCoupon = await prisma.coupon.create({
      data: {
        userId: MOCK_USER_ID,
        storeName: data.storeName,
        code: data.code,
        discount: data.discount,
        link: data.link === "" ? null : data.link,
        active: data.active,
      },
    });

    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error) {
    console.error("[COUPONS_POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar cupom" },
      { status: 500 }
    );
  }
}