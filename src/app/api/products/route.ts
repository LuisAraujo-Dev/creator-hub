// src/app/api/products/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as z from "zod";

const MOCK_USER_ID = "clerk_user_id_mock_1";

const productSchema = z.object({
  title: z.string().min(3, "O título é obrigatório."),
  description: z.string().optional().nullable(),
  affiliateUrl: z.string().url("URL de afiliado inválida."),
  imageUrl: z.string().url("URL da imagem inválida.").optional().or(z.literal("")).nullable(),
  price: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validation.data;

    const newProduct = await prisma.product.create({
      data: {
        userId: MOCK_USER_ID,
        title: data.title,
        description: data.description,
        affiliateUrl: data.affiliateUrl,
        imageUrl: data.imageUrl === "" ? null : data.imageUrl,
        price: data.price,
        active: data.active,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}