// src/app/api/coupons/route.tsx
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as z from "zod";
import { checkSubscription } from "@/lib/subscription";

const couponSchema = z.object({
  storeName: z.string().min(2, "Nome da loja é obrigatório."),
  code: z.string().min(3, "O código deve ter pelo menos 3 caracteres."),
  discount: z.string().min(1, "O desconto é obrigatório."),
  link: z.string().url("A URL é inválida.").optional().or(z.literal("")).nullable(),
  active: z.boolean().default(true),
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const coupons = await prisma.coupon.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error("[COUPONS_GET]", error);
    return NextResponse.json({ error: "Erro ao buscar cupons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await request.json();
    const validation = couponSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const isPro = await checkSubscription();

    if (!isPro) {
      const count = await prisma.coupon.count({
        where: { userId },
      });

      if (count >= 1) {
        return NextResponse.json(
          { error: "Plano Grátis permite apenas 1 cupom. Assine o Pro para ilimitados." },
          { status: 403 }
        );
      }
    }

    const data = validation.data;

    const newCoupon = await prisma.coupon.create({
      data: {
        userId,
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
    return NextResponse.json({ error: "Erro ao criar cupom" }, { status: 500 });
  }
}