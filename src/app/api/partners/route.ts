// src/app/api/partners/route.tsx
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as z from "zod";

const partnerSchema = z.object({
  name: z.string().min(2, "Nome do parceiro é obrigatório"),
  siteUrl: z.string().url("URL do site inválida"),
  logoUrl: z.string().url("URL do logo inválida").optional().or(z.literal("")),
  active: z.boolean().default(true),
});

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const partners = await prisma.partner.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(partners);
  } catch (error) {
    console.error("[PARTNERS_GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar parceiros" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validation = partnerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validation.data;

    const newPartner = await prisma.partner.create({
      data: {
        userId,
        name: data.name,
        siteUrl: data.siteUrl,
        logoUrl: data.logoUrl || null, 
        active: data.active,
      },
    });

    return NextResponse.json(newPartner, { status: 201 });
  } catch (error) {
    console.error("[PARTNERS_POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar parceiro" },
      { status: 500 }
    );
  }
}