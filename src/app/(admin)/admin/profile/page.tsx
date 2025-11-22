//src/app/(admin)/admin/profile/page.tsx
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./components/profile-form";

export default async function ProfilePage() {
    const { userId } = await auth();

    if (!userId) redirect("/sign-in");

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { socialLinks: true }
    });

    if (!user) {
        redirect("/onboarding");
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <header>
                <h2 className="text-2xl font-bold tracking-tight">Meu Perfil</h2>
                <p className="text-sm text-muted-foreground">
                    Edite sua imagem, biografia e links principais.
                </p>
            </header>
            
            <Separator />
            
            <ProfileForm initialData={user} />
        </div>
    );
}