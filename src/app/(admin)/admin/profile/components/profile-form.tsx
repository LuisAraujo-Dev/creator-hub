//src/app/(admin)/admin/profile/components/profile-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { User, SocialLinks } from "@prisma/client"; 
import { ImageUpload } from "@/components/ui/image-upload"; 
import { 
  Instagram, Facebook, Linkedin, Twitter, Youtube, 
  MessageCircle, Globe, Send, Gamepad2, Camera, Video, Ghost 
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type UserWithSocials = User & {
    socialLinks: SocialLinks | null;
}

const SOCIAL_CONFIG = [
    { id: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/..." },
    { id: "tiktok", label: "TikTok", icon: Video, placeholder: "https://tiktok.com/@..." },
    { id: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@..." },
    { id: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/..." },
    { id: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://twitter.com/..." },
    { id: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/..." },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, placeholder: "https://wa.me/..." },
    { id: "telegram", label: "Telegram", icon: Send, placeholder: "https://t.me/..." },
    { id: "discord", label: "Discord", icon: Gamepad2, placeholder: "https://discord.gg/..." },
    { id: "twitch", label: "Twitch", icon: Gamepad2, placeholder: "https://twitch.tv/..." },
    { id: "pinterest", label: "Pinterest", icon: Camera, placeholder: "https://pinterest.com/..." },
    { id: "strava", label: "Strava", icon: Globe, placeholder: "https://strava.com/athletes/..." },
    { id: "kwai", label: "Kwai", icon: Video, placeholder: "Link do perfil Kwai" },
    { id: "vsco", label: "VSCO", icon: Camera, placeholder: "https://vsco.co/..." },
    { id: "snapchat", label: "Snapchat", icon: Ghost, placeholder: "https://snapchat.com/add/..." },
    { id: "onlyfans", label: "OnlyFans", icon:  Camera, placeholder: "https://onlyfans.com/..." },
    { id: "github", label: "GitHub", icon: Globe, placeholder: "https://github.com/..." },
] as const;

const optionalString = z.string().optional().or(z.literal('')).nullable();

const profileSchema = z.object({
  name: z.string({
    required_error: "O nome é obrigatório.",
    invalid_type_error: "O nome deve ser um texto.",
  }).min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }).max(50, {
    message: "O nome pode ter no máximo 50 caracteres.",
  }),
  bio: z.string().max(160, "A bio deve ter no máximo 160 caracteres.").optional().or(z.literal('')).nullable(),
  avatarUrl: optionalString,
  
  instagram: optionalString,
  tiktok: optionalString,
  youtube: optionalString,
  facebook: optionalString,
  twitter: optionalString,
  linkedin: optionalString,
  whatsapp: optionalString,
  telegram: optionalString,
  discord: optionalString,
  twitch: optionalString,
  pinterest: optionalString,
  strava: optionalString,
  kwai: optionalString,
  vsco: optionalString,
  snapchat: optionalString,
  onlyfans: optionalString,
  github: optionalString,
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    initialData: UserWithSocials | null;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const [activeNetworks, setActiveNetworks] = useState<Record<string, boolean>>(() => {
        const socials = initialData?.socialLinks as any || {};
        const initialActive: Record<string, boolean> = {};
        SOCIAL_CONFIG.forEach((net) => {
            if (socials[net.id] && socials[net.id].length > 0) {
                initialActive[net.id] = true;
            }
        });
        return initialActive;
    });

    const prepareDefaultValues = () => {
        const socials = initialData?.socialLinks as any || {};
        const sanitizedSocials: Record<string, any> = {};

        SOCIAL_CONFIG.forEach((net) => {
            const val = socials[net.id];
            sanitizedSocials[net.id] = val === null || val === undefined ? "" : val;
        });

        return {
            name: initialData?.name || "",
            bio: initialData?.bio || "", 
            avatarUrl: initialData?.avatarUrl || "", 
            ...sanitizedSocials
        };
    };

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: prepareDefaultValues(),
    });

    const toggleNetwork = (id: string, active: boolean) => {
        setActiveNetworks(prev => ({ ...prev, [id]: active }));
        if (!active) {
            form.setValue(id as any, ""); 
        }
    };

    async function onSubmit(data: ProfileFormValues) {
        try {
            setIsSaving(true);
            await axios.put('/api/profile', data);
            toast.success("Perfil atualizado com sucesso!");
            router.refresh(); 
        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar perfil.");
        } finally {
            setIsSaving(false);
        }
    }

    function onInvalid(errors: any) {
        console.error("Erros de validação:", errors);
        const firstError = Object.values(errors)[0] as any;
        if (firstError) {
            toast.error(`Erro no campo: ${firstError.message || "Verifique os dados"}`);
        } else {
            toast.error("Existem erros no formulário. Verifique os campos.");
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 w-full">
            
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
                    <CardDescription>Ative e adicione os links das redes que você utiliza.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SOCIAL_CONFIG.map((net) => {
                            const isActive = activeNetworks[net.id];
                            const Icon = net.icon;

                            return (
                                <div key={net.id} className={`border rounded-lg p-4 transition-all ${isActive ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-100 opacity-70 hover:opacity-100'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-2 rounded-full ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                                <Icon size={18} />
                                            </div>
                                            <Label htmlFor={`switch-${net.id}`} className="cursor-pointer font-semibold text-sm">
                                                {net.label}
                                            </Label>
                                        </div>
                                        <Switch 
                                            id={`switch-${net.id}`}
                                            checked={isActive}
                                            onCheckedChange={(val) => toggleNetwork(net.id, val)}
                                        />
                                    </div>
                                    
                                    {isActive && (
                                        <div className="mt-3 animate-in slide-in-from-top-2 fade-in duration-200">
                                            <Input 
                                                placeholder={net.placeholder} 
                                                {...form.register(net.id as any)} 
                                                className="bg-white"
                                                disabled={isSaving}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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