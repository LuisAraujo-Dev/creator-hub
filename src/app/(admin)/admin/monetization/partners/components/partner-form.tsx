// src/app/(admin)/admin/monetization/partners/components/partner-form.tsx
"use client";

import { Button } from "@/components/ui/button";


import { Partner } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";

const partnerSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  siteUrl: z.string().url("URL inválida"),
  logoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  active: z.boolean(),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

interface PartnerFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partner | null;
}

export function PartnerForm({ isOpen, onClose, initialData }: PartnerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData;

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      siteUrl: "",
      logoUrl: "",
      active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        siteUrl: initialData.siteUrl,
        logoUrl: initialData.logoUrl || "",
        active: initialData.active,
      });
    } else {
      form.reset({
        name: "",
        siteUrl: "",
        logoUrl: "",
        active: true,
      });
    }
  }, [initialData, form]);

  async function onSubmit(data: PartnerFormValues) {
    setIsSubmitting(true);
    try {
      const endpoint = isEditMode ? `/api/partners/${initialData?.id}` : "/api/partners";
      const method = isEditMode ? "PUT" : "POST";

      const payload = {
        ...data,
        logoUrl: data.logoUrl === "" ? null : data.logoUrl,
      };

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(isEditMode ? "Parceiro atualizado!" : "Parceiro criado!");
        form.reset();
        onClose();
      } else {
        const responseData = await response.json(); 
      
      if (responseData.error) {
          toast.error(responseData.error); 
      } else {
          toast.error("Erro ao salvar.");
      }
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-lg w-full p-0 flex flex-col bg-white h-full">
        
        <div className="p-6 border-b border-gray-100">
            <SheetHeader>
            <SheetTitle>{isEditMode ? "Editar Parceiro" : "Novo Parceiro"}</SheetTitle>
            <SheetDescription>
                {isEditMode ? "Edite os dados da parceria." : "Adicione um novo parceiro ou patrocinador."}
            </SheetDescription>
            </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <form id="partner-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-2">
                <Label htmlFor="name">Nome da Marca/Parceiro</Label>
                <Input id="name" placeholder="Ex: Nike, Adidas..." {...form.register("name")} />
                {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="siteUrl">Link do Site (Parceria)</Label>
                <Input id="siteUrl" placeholder="https://parceiro.com/ref=voce" {...form.register("siteUrl")} />
                {form.formState.errors.siteUrl && <p className="text-xs text-red-500">{form.formState.errors.siteUrl.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Logo da Marca</Label>
                <div className="flex justify-center border rounded-md p-4 bg-gray-50/50">
                    <ImageUpload
                        value={form.watch("logoUrl") || ""}
                        onChange={(url) => form.setValue("logoUrl", url, { shouldValidate: true })}
                        disabled={isSubmitting}
                    />
                </div>
                <p className="text-[0.8rem] text-muted-foreground">
                    Logos com fundo transparente (PNG) ficam melhores.
                </p>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-slate-900">Exibição</span>
                    <span className="text-[10px] text-muted-foreground">
                        Controla a visibilidade da parceria.
                    </span>
                </div>
                
                <Switch
                    checked={form.watch("active")}
                    onCheckedChange={(val) => form.setValue("active", val)}
                />
            </div>

            </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 mt-auto">
            <SheetFooter>
                <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                    Cancelar
                </Button>
                <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isEditMode ? "Salvar" : "Criar"}
                </Button>
            </SheetFooter>
        </div>

      </SheetContent>
    </Sheet>
  );
}   