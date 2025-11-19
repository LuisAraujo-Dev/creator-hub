"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Partner } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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
        form.reset();
        onClose();
      } else {
        console.error("Erro ao salvar parceiro");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Parceiro" : "Novo Parceiro"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Marca/Parceiro</Label>
            <Input id="name" placeholder="Ex: Nike, Adidas..." {...form.register("name")} />
            {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteUrl">Link do Site (Parceria)</Label>
            <Input id="siteUrl" placeholder="https://parceiro.com/ref=voce" {...form.register("siteUrl")} />
            {form.formState.errors.siteUrl && <p className="text-red-500 text-sm">{form.formState.errors.siteUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">URL do Logo (Opcional)</Label>
            <Input id="logoUrl" placeholder="https://..." {...form.register("logoUrl")} />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="active">Parceria Ativa</Label>
            <Switch
              id="active"
              checked={form.watch("active")}
              onCheckedChange={(val) => form.setValue("active", val)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}