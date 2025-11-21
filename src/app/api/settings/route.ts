// src/app/api/settings/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const settingsSchema = z.object({
  themeColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Cor inválida (Use Hex: #000000)"),
});

const MOCK_USER_ID = "clerk_user_id_mock_1";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data = settingsSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: MOCK_USER_ID },
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