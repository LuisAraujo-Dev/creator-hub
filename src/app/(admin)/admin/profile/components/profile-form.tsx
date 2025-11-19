"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import axios from "axios"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, SocialLinks } from "@prisma/client"; 

type UserWithSocials = User & {
    socialLinks: SocialLinks | null;
}

const profileSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(50),
  bio: z.string().max(160).optional(),
  avatarUrl: z.string().url("URL inválida").optional().or(z.literal('')),
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>Informações Principais</CardTitle>
                    <CardDescription>Nome e frase de impacto que aparecem na sua página.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" placeholder="Seu nome" {...form.register("name")} />
                        {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" className="resize-none" placeholder="Sobre você..." {...form.register("bio")} />
                        {form.formState.errors.bio && <p className="text-sm text-red-500">{form.formState.errors.bio.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avatarUrl">URL do Avatar</Label>
                        <Input id="avatarUrl" placeholder="https://..." {...form.register("avatarUrl")} />
                    </div>
                </CardContent>
            </Card>

            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>Redes Sociais</CardTitle>
                    <CardDescription>Links que aparecerão no topo do perfil.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input id="instagram" placeholder="URL completa" {...form.register("instagram")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="strava">Strava</Label>
                        <Input id="strava" placeholder="URL completa" {...form.register("strava")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="youtube">Youtube</Label>
                        <Input id="youtube" placeholder="URL completa" {...form.register("youtube")} />
                    </div>
                </CardContent>
            </Card>
            
            <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
        </form>
    );
}