"use client";

import React, { useState } from "react"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionButton } from "@/components/subscription-button";
import { THEMES, ThemeKey } from "@/lib/themes";
import { cn } from "../../../../../../lib/utils";

const settingsSchema = z.object({
  themeColor: z.string().min(4),
  theme: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialData: {
    themeColor: string;
    theme?: string; 
    isPro?: boolean; 
  };
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const isPro = !!initialData.isPro;

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      themeColor: initialData.themeColor || "#000000",
      theme: initialData.theme || "light",
    },
  });

  async function onSubmit(data: SettingsFormValues) {
    try {
      setIsSaving(true);
      await axios.put("/api/settings", data);
      toast.success("Configurações atualizadas!");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao salvar configurações.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
      
      {/* SELETOR DE TEMAS */}
      <Card>
        <CardHeader>
          <CardTitle>Tema da Página</CardTitle>
          <CardDescription>Escolha o estilo visual do seu perfil público.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(THEMES).map(([key, theme]) => {
              const isLocked = theme.type === "pro" && !isPro;
              const isSelected = form.watch("theme") === key;

              return (
                <div 
                  key={key}
                  onClick={() => !isLocked && form.setValue("theme", key, { shouldDirty: true })}
                  className={cn(
                    "relative cursor-pointer rounded-xl border-2 p-1 transition-all overflow-hidden",
                    isSelected ? "border-blue-600 ring-2 ring-blue-100" : "border-transparent hover:border-gray-200",
                    isLocked && "opacity-70 grayscale cursor-not-allowed"
                  )}
                >
                  {/* Preview do Tema */}
                  <div className={cn("h-24 rounded-lg flex items-center justify-center mb-2 shadow-inner", theme.bgClass)}>
                    <div className={cn("w-16 h-8 rounded-md text-[8px] flex items-center justify-center shadow-sm", theme.cardClass)}>
                        <span className={theme.textClass}>Preview</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-medium">{theme.label}</span>
                    {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* COR DO TEMA (Legado/Accent) */}
      <Card>
        <CardHeader>
          <CardTitle>Cor de Destaque</CardTitle>
          <CardDescription>Usada em detalhes e botões específicos.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4">
              <div 
                className="h-10 w-10 rounded-full border shadow-sm shrink-0" 
                style={{ backgroundColor: form.watch("themeColor") }} 
              />
              <Input
                {...form.register("themeColor")}
                className="font-mono w-[150px]"
              />
              <div className="relative">
                <input 
                  type="color" 
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  value={form.watch("themeColor")}
                  onChange={(e) => form.setValue("themeColor", e.target.value)}
                />
                <Label className="cursor-pointer text-sm text-blue-600 hover:underline">Escolher</Label>
              </div>
            </div>
        </CardContent>
      </Card>

      <Card className="border-blue-100 bg-blue-50/50 dark:bg-slate-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             Plano Atual
             <span className={`text-xs font-normal px-2 py-1 rounded-full ${isPro ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {isPro ? "Pro" : "Grátis"}
             </span>
          </CardTitle>
          <CardDescription>Gerencie sua assinatura.</CardDescription>
        </CardHeader>
        <CardContent>
           <SubscriptionButton isPro={isPro} />
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