// src/app/api/products/[id]/route.tsx
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const updateProductSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional().nullable(),
  affiliateUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  price: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

interface Context {
  params: {
    id: string;
  };
}

export async function DELETE(request: Request, context: Context) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = context.params;

    const product = await prisma.product.findUnique({
      where: { id, userId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado ou permissão negada" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Produto removido" });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = context.params;
    const body = await request.json();

    const validation = updateProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id, userId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...validation.data,
        imageUrl: validation.data.imageUrl === "" ? null : validation.data.imageUrl,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("[PRODUCT_UPDATE]", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}