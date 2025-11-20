import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().optional(),
  avatarUrl: z.string().optional().or(z.literal('')),
  instagram: z.string().optional().or(z.literal('')),
  strava: z.string().optional().or(z.literal('')),
  youtube: z.string().optional().or(z.literal('')),
});

const MOCK_USER_ID = "clerk_user_id_mock_1";

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { id: MOCK_USER_ID },
      include: { socialLinks: true }, 
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data = profileSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: MOCK_USER_ID },
        data: {
          name: data.name,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
        },
      });

      const updatedSocials = await tx.socialLinks.upsert({
        where: { userId: MOCK_USER_ID },
        create: {
            userId: MOCK_USER_ID,
            instagram: data.instagram,
            showInsta: !!data.instagram,
            strava: data.strava,
            showStrava: !!data.strava,
            youtube: data.youtube,
            showYoutube: !!data.youtube,
        },
        update: {
            instagram: data.instagram,
            showInsta: !!data.instagram,
            strava: data.strava,
            showStrava: !!data.strava,
            youtube: data.youtube,
            showYoutube: !!data.youtube,
        }
      });

      return { ...updatedUser, socialLinks: updatedSocials };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
  }
}