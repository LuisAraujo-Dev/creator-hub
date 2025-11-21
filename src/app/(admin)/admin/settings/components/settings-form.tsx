//src/app/(admin)/admin/settings/components/settings-form.tsx
"use client";

import React, { useState } from "react"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card";

const settingsSchema = z.object({
  themeColor: z.string().min(4).regex(new RegExp("^#"), "Deve começar com #"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialData: {
    themeColor: string;
  };
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      themeColor: initialData.themeColor || "#000000",
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
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>
            Personalize como sua página pública é exibida para os visitantes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="themeColor">Cor do Tema</Label>
            <div className="flex items-center gap-4">
              <div 
                className="h-10 w-10 rounded-full border shadow-sm shrink-0" 
                style={{ backgroundColor: form.watch("themeColor") }} 
              />
              
              <Input
                id="themeColor"
                placeholder="#000000"
                {...form.register("themeColor")}
                className="font-mono w-[150px]"
              />
              
              <div className="relative">
                <input 
                  type="color" 
                  id="color-picker"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  value={form.watch("themeColor")}
                  onChange={(e) => form.setValue("themeColor", e.target.value)}
                />
                <Label htmlFor="color-picker" className="cursor-pointer text-sm text-blue-600 hover:underline">
                  Escolher cor
                </Label>
              </div>
            </div>
            
            {form.formState.errors.themeColor && (
              <p className="text-xs text-red-500">{form.formState.errors.themeColor.message}</p>
            )}
            
            <p className="text-[0.8rem] text-muted-foreground">
                Essa cor será usada na barra lateral dos cartões da sua página pública.
            </p>
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