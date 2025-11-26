// src/app/api/profile/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { checkSubscription } from "@/lib/subscription";

const optionalString = z.string().optional().or(z.literal('')).nullable();

const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().optional().or(z.literal("")).nullable(),
  avatarUrl: optionalString,

  instagram: optionalString,
  tiktok: optionalString,
  youtube: optionalString,
  twitter: optionalString,
  strava: optionalString,
  linkedin: optionalString,
  github: optionalString,
  whatsapp: optionalString,
  facebook: optionalString,
  pinterest: optionalString,
  telegram: optionalString,
  discord: optionalString,
  twitch: optionalString,
  kwai: optionalString,
  vsco: optionalString,
  snapchat: optionalString,
  onlyfans: optionalString,
});

const SOCIAL_KEYS = [
  "instagram", "tiktok", "youtube", "twitter", "strava", "linkedin", 
  "github", "whatsapp", "facebook", "pinterest", "telegram", 
  "discord", "twitch", "kwai", "vsco", "snapchat", "onlyfans"
];

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { socialLinks: true },
    });

    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await request.json();
    const data = profileSchema.parse(body);

    const isPro = await checkSubscription();

    if (!isPro) {
      let activeSocialsCount = 0;
      
      for (const key of SOCIAL_KEYS) {
        // @ts-ignore
        if (data[key] && data[key].trim().length > 0) {
          activeSocialsCount++;
        }
      }

      if (activeSocialsCount > 2) {
        return NextResponse.json(
          { error: "Plano Grátis permite apenas 2 redes sociais ativas. Assine o Pro para liberar todas." },
          { status: 403 }
        );
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          name: data.name,
          bio: data.bio,
          avatarUrl: data.avatarUrl || null,
        },
      });

      const socialData = {
        instagram: data.instagram || null, showInsta: !!data.instagram,
        tiktok: data.tiktok || null, showTiktok: !!data.tiktok,
        youtube: data.youtube || null, showYoutube: !!data.youtube,
        twitter: data.twitter || null, showTwitter: !!data.twitter,
        strava: data.strava || null, showStrava: !!data.strava,
        linkedin: data.linkedin || null, showLinkedin: !!data.linkedin,
        github: data.github || null, showGithub: !!data.github,
        whatsapp: data.whatsapp || null, showWhatsapp: !!data.whatsapp,
        facebook: data.facebook || null, showFacebook: !!data.facebook,
        pinterest: data.pinterest || null, showPinterest: !!data.pinterest,
        telegram: data.telegram || null, showTelegram: !!data.telegram,
        discord: data.discord || null, showDiscord: !!data.discord,
        twitch: data.twitch || null, showTwitch: !!data.twitch,
        kwai: data.kwai || null, showKwai: !!data.kwai,
        vsco: data.vsco || null, showVsco: !!data.vsco,
        snapchat: data.snapchat || null, showSnapchat: !!data.snapchat,
        onlyfans: data.onlyfans || null, showOnlyfans: !!data.onlyfans,
      };

      const updatedSocials = await tx.socialLinks.upsert({
        where: { userId: userId },
        create: { userId: userId, ...socialData },
        update: { ...socialData }
      });

      return { ...updatedUser, socialLinks: updatedSocials };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
  }
}