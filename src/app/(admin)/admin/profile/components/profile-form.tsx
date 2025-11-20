"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, SocialLinks } from "@prisma/client"; 
import { ImageUpload } from "@/src/components/ui/image-upload";

type UserWithSocials = User & {
    socialLinks: SocialLinks | null;
}

const profileSchema = z.object({
  name: z.string({
    required_error: "O nome é obrigatório.",
    invalid_type_error: "O nome deve ser um texto.",
  }).min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }).max(50, {
    message: "O nome pode ter no máximo 50 caracteres.",
  }),
  bio: z.string().max(160, "A bio deve ter no máximo 160 caracteres.").optional(),
  avatarUrl: z.string().optional().or(z.literal('')),
  instagram: z.string().optional().or(z.literal('')),
  strava: z.string().optional().or(z.literal('')),
  youtube: z.string().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    initialData: UserWithSocials | null;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: initialData?.name || "",
            bio: initialData?.bio || "",
            avatarUrl: initialData?.avatarUrl || "",
            instagram: initialData?.socialLinks?.instagram || "",
            strava: initialData?.socialLinks?.strava || "",
            youtube: initialData?.socialLinks?.youtube || ""
        },
    });

    async function onSubmit(data: ProfileFormValues) {
        try {
            setIsSaving(true);
            await axios.put('/api/profile', data);
            router.refresh(); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            
            <Card>
                <CardHeader>
                    <CardTitle>Informações Principais</CardTitle>
                    <CardDescription>Nome e frase de impacto que aparecem na sua página.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    
                    <div className="space-y-2">
                        <Label>Foto de Perfil</Label>
                        <div className="flex justify-center md:justify-start">
                            <ImageUpload 
                                value={form.watch("avatarUrl") || ""} 
                                onChange={(url) => form.setValue("avatarUrl", url, { shouldValidate: true })} 
                                disabled={isSaving}
                            />
                        </div>
                        <p className="text-[0.8rem] text-muted-foreground">
                            Recomendado: Imagem quadrada, max 4MB.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input 
                            id="name" 
                            placeholder="Seu nome ou nome do canal" 
                            disabled={isSaving} 
                            {...form.register("name")} 
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm font-medium text-red-500">
                                {form.formState.errors.name.message}
                            </p>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio (Frase de Efeito)</Label>
                        <Textarea 
                            id="bio" 
                            className="resize-none" 
                            placeholder="Compartilho minha rotina de treinos..." 
                            disabled={isSaving}
                            {...form.register("bio")} 
                        />
                        {form.formState.errors.bio && (
                            <p className="text-sm font-medium text-red-500">
                                {form.formState.errors.bio.message}
                            </p>
                        )}
                    </div>

                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Redes Sociais</CardTitle>
                    <CardDescription>Links que aparecerão no topo do perfil.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input 
                            id="instagram" 
                            placeholder="https://instagram.com/seuusuario" 
                            disabled={isSaving}
                            {...form.register("instagram")} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="strava">Strava</Label>
                        <Input 
                            id="strava" 
                            placeholder="https://strava.com/athletes/..." 
                            disabled={isSaving}
                            {...form.register("strava")} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="youtube">Youtube</Label>
                        <Input 
                            id="youtube" 
                            placeholder="https://youtube.com/@..." 
                            disabled={isSaving}
                            {...form.register("youtube")} 
                        />
                    </div>
                </CardContent>
            </Card>
            
            <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} size="lg">
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
            </div>
        </form>
    );
}