import { Separator } from "@radix-ui/react-dropdown-menu";
import { SettingsForm } from "./components/settings-form.tsx";
import prisma from "@/lib/prisma.js";


const MOCK_USER_ID = "clerk_user_id_mock_1";

export default async function SettingsPage() {
  const user = await prisma.user.findUnique({
    where: { id: MOCK_USER_ID },
    select: { themeColor: true },
  });

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie as preferências da sua conta e da página pública.
        </p>
      </header>

      <Separator />

      <SettingsForm initialData={user} />
    </div>
  );
}