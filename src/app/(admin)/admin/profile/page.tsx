//src/app/(admin)/admin/profile/page.tsx
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ProfileForm } from "./components/profile-form"; 
import prisma from "@/lib/prisma";

const MOCK_USER_ID = "clerk_user_id_mock_1";

export default async function ProfilePage() {
    const user = await prisma.user.findUnique({
        where: { id: MOCK_USER_ID },
        include: { socialLinks: true }
    });

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