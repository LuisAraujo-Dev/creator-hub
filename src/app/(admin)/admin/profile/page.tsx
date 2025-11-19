import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

const MOCKED_USER_DATA = {
    name: 'Luís Runner',
    bio: 'Compartilhando minha jornada de 365 dias de corrida. Fé e persistência! 🏃‍♂️🔥',
    avatarUrl: 'https://github.com/shadcn.png',
    socials: {
        instagram: 'https://instagram.com/luisrun',
        strava: 'https://strava.com/athletes/luis',
        youtube: 'https://youtube.com/@luisrun',
        showStrava: true,
        showInstagram: true
    }
}

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }).max(50, {
    message: "O nome não pode exceder 50 caracteres."
  }),
  bio: z.string().max(160, {
    message: "A frase deve ter no máximo 160 caracteres."
  }).optional(),
  avatarUrl: z.string().url({ message: "URL do Avatar inválida." }).optional().or(z.literal('')),
  
  instagram: z.string().url({ message: "URL do Instagram inválida." }).optional().or(z.literal('')),
  strava: z.string().url({ message: "URL do Strava inválida." }).optional().or(z.literal('')),
  youtube: z.string().url({ message: "URL do Youtube inválida." }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: MOCKED_USER_DATA.name,
            bio: MOCKED_USER_DATA.bio,
            avatarUrl: MOCKED_USER_DATA.avatarUrl,
            instagram: MOCKED_USER_DATA.socials.instagram,
            strava: MOCKED_USER_DATA.socials.strava,
            youtube: MOCKED_USER_DATA.socials.youtube
        },
        mode: "onChange",
    });

    function onSubmit(data: ProfileFormValues) {
        setIsSaving(true);
        console.log("Dados do formulário validados e prontos para o envio (Payload):", data);
        
        setTimeout(() => {
            setIsSaving(false);
            console.log("SALVO! Na próxima etapa, enviaremos isso para a API.");
        }, 1500);
    }

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-2xl font-bold tracking-tight">Meu Perfil</h2>
                <p className="text-sm text-muted-foreground">
                    Edite sua imagem, biografia e links principais para a página pública.
                </p>
            </header>
            
            <Separator />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Informações Principais</CardTitle>
                        <CardDescription>Nome e frase de impacto que aparecem na sua página.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input 
                                id="name" 
                                placeholder="Seu nome ou nome de criador" 
                                {...form.register("name")}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm font-medium text-red-500">{form.formState.errors.name.message}</p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="bio">Frase de Impacto (Bio)</Label>
                            <Textarea 
                                id="bio" 
                                placeholder="Compartilho dicas de corrida e reviews de tênis..." 
                                className="resize-none"
                                {...form.register("bio")}
                            />
                            {form.formState.errors.bio && (
                                <p className="text-sm font-medium text-red-500">{form.formState.errors.bio.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="avatarUrl">URL da Foto de Perfil</Label>
                            <Input 
                                id="avatarUrl" 
                                placeholder="https://..." 
                                {...form.register("avatarUrl")}
                            />
                            {form.formState.errors.avatarUrl && (
                                <p className="text-sm font-medium text-red-500">{form.formState.errors.avatarUrl.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Links de Redes Sociais</CardTitle>
                        <CardDescription>URLs que aparecerão como ícones no topo da sua página.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram (URL Completa)</Label>
                            <Input 
                                id="instagram" 
                                placeholder="https://instagram.com/seuusuario" 
                                {...form.register("instagram")}
                            />
                            {form.formState.errors.instagram && (
                                <p className="text-sm font-medium text-red-500">{form.formState.errors.instagram.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="strava">Strava (URL Completa)</Label>
                            <Input 
                                id="strava" 
                                placeholder="https://strava.com/athletes/seuusuario" 
                                {...form.register("strava")}
                            />
                            {form.formState.errors.strava && (
                                <p className="text-sm font-medium text-red-500">{form.formState.errors.strava.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="youtube">Youtube (URL Completa)</Label>
                            <Input 
                                id="youtube" 
                                placeholder="https://youtube.com/@seuusuario" 
                                {...form.register("youtube")}
                            />
                             {form.formState.errors.youtube && (
                                <p className="text-sm font-medium text-red-500">{form.formState.errors.youtube.message}</p>
                            )}
                        </div>
                        
                    </CardContent>
                </Card>
                
                <Button type="submit" disabled={isSaving || !form.formState.isValid}>
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
            </form>
        </div>
    );
}