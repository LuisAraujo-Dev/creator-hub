// src/api/onboarding/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Força a rota a ser dinâmica para evitar cache estático
export const dynamic = 'force-dynamic';

const onboardingSchema = z.object({
  username: z.string()
    .min(3, "O usuário deve ter pelo menos 3 caracteres")
    .regex(/^[a-z0-9-_]+$/, "Apenas letras minúsculas, números, hífens e sublinhados"),
});

export async function POST(request: Request) {
  try {
    // 1. Pega o ID da sessão
    const { userId } = await auth();
    
    if (!userId) {
      console.log("[ONBOARDING] Falha de Auth: userId não encontrado.");
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    // 2. CORREÇÃO AQUI: Instancia o cliente do Clerk antes de usar
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const body = await request.json();
    const validation = onboardingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { username } = validation.data;

    // 3. Verifica duplicidade
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Este nome de usuário já está em uso." }, { status: 409 });
    }

    // 4. Pega o e-mail
    const email = user.emailAddresses[0]?.emailAddress;

    // 5. Cria no banco
    await prisma.user.create({
      data: {
        id: userId,
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