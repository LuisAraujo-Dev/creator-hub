import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const partnerSchema = z.object({
  name: z.string().min(2).optional(),
  siteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
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

    const partner = await prisma.partner.findUnique({
      where: { id, userId: MOCK_USER_ID },
    });

    if (!partner) {
      return NextResponse.json(
        { error: "Parceiro não encontrado ou permissão negada" },
        { status: 404 }
      );
    }

    await prisma.partner.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Parceiro removido com sucesso" });
  } catch (error) {
    console.error("[PARTNER_DELETE]", error);
    return NextResponse.json({ error: "Erro interno ao deletar" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = context.params;
    const body = await request.json();

    const validation = partnerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.findUnique({
      where: { id, userId: MOCK_USER_ID },
    });

    if (!partner) {
      return NextResponse.json(
        { error: "Parceiro não encontrado ou permissão negada" },
        { status: 404 }
      );
    }

    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: {
        ...validation.data,
        logoUrl: validation.data.logoUrl === "" ? null : validation.data.logoUrl,
      },
    });

    return NextResponse.json(updatedPartner);
  } catch (error) {
    console.error("[PARTNER_UPDATE]", error);
    return NextResponse.json({ error: "Erro interno ao atualizar" }, { status: 500 });
  }
}