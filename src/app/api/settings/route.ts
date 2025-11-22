// src/app/api/settings/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const settingsSchema = z.object({
  themeColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Cor inválida (Use Hex: #000000)"),
});

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const data = settingsSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        themeColor: data.themeColor,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[SETTINGS_UPDATE]", error);
    return NextResponse.json({ error: "Erro ao atualizar configurações" }, { status: 500 });
  }
}