import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema para validação (campos opcionais na edição)
const updateProductSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  affiliateUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  price: z.string().optional(),
  active: z.boolean().optional(),
});

const MOCK_USER_ID = "clerk_user_id_mock_1";

interface Context {
  params: {
    id: string;
  };
}

// --- DELETE: Remover Produto ---
export async function DELETE(request: Request, context: Context) {
  try {
    const { id } = context.params;

    // Verifica se o produto existe e pertence ao usuário
    const product = await prisma.product.findUnique({
      where: { id, userId: MOCK_USER_ID },
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

// --- PUT: Atualizar Produto ---
export async function PUT(request: Request, context: Context) {
  try {
    const { id } = context.params;
    const body = await request.json();

    const validation = updateProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verifica propriedade
    const existingProduct = await prisma.product.findUnique({
      where: { id, userId: MOCK_USER_ID },
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
        // Limpa imagem se vier string vazia
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