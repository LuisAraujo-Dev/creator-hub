// src/api/onboarding/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const onboardingSchema = z.object({
  username: z.string()
    .min(3, "O usuário deve ter pelo menos 3 caracteres")
    .regex(/^[a-z0-9-_]+$/, "Apenas letras minúsculas, números, hífens e sublinhados"),
});

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    
    if (!user || !user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validation = onboardingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { username } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Este nome de usuário já está em uso." }, { status: 409 });
    }

    const email = user.emailAddresses[0]?.emailAddress;

    await prisma.user.create({
      data: {
        id: user.id, 
        username,
        email,
        name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : username,
        avatarUrl: user.imageUrl,
        socialLinks: {
          create: {
            showInsta: false
          }
        }
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[ONBOARDING_ERROR]", error);
    return NextResponse.json({ error: "Erro interno ao criar conta." }, { status: 500 });
  }
}