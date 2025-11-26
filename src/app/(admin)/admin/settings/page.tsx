//src/app/(admin)/admin/settings/page.tsx
import { Separator } from "@/components/ui/separator";
import { SettingsForm } from "./components/settings-form";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { themeColor: true },
  });

  if (!user) redirect("/onboarding");

  const userSubscription = await prisma.userSubscription.findUnique({
    where: { userId },
    select: {
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
      stripeSubscriptionId: true,
    },
  });

  const isPro = !!userSubscription?.stripePriceId && 
                (userSubscription.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 > Date.now());

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie as preferências da sua conta e da página pública.
        </p>
      </header>

      <Separator />

      <SettingsForm initialData={{ ...user, isPro }} />
    </div>
  );
}