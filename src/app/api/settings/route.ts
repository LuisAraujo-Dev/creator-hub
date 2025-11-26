// src/app/api/settings/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { checkSubscription } from "@/lib/subscription";
import { THEMES } from "@/lib/themes";

const settingsSchema = z.object({
  themeColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Cor inválida"),
  theme: z.string().optional(), 
});

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await request.json();
    const data = settingsSchema.parse(body);
    const isPro = await checkSubscription();

    let themeToSave = data.theme || "light";
    
    // @ts-ignore
    const selectedTheme = THEMES[themeToSave];
    
    if (selectedTheme?.type === "pro" && !isPro) {
      themeToSave = "light"; 
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        themeColor: data.themeColor,
        theme: themeToSave,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[SETTINGS_UPDATE]", error);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}