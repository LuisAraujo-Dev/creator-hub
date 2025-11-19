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
import { Product } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const productSchema = z.object({
  title: z.string().min(3, "O título precisa ter pelo menos 3 caracteres."),
  description: z.string().max(200, "Descrição muito longa.").optional(),
  affiliateUrl: z.string().url("A URL de afiliado é inválida."),
  imageUrl: z.string().url("A URL da imagem é inválida.").optional().or(z.literal("")),
  price: z.string().optional(),
  active: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Product | null; 
}

export function ProductForm({ isOpen, onClose, initialData }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      affiliateUrl: initialData.affiliateUrl,
      active: initialData.active,
      description: initialData.description || undefined,
      price: initialData.price || undefined,
      imageUrl: initialData.imageUrl || "",
    } : {
      title: "",
      description: "",
      affiliateUrl: "",
      imageUrl: "",
      price: "",
      active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        affiliateUrl: initialData.affiliateUrl,
        active: initialData.active,
        description: initialData.description || undefined,
        price: initialData.price || undefined,
        imageUrl: initialData.imageUrl || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        affiliateUrl: "",
        imageUrl: "",
        price: "",
        active: true,
      });
    }
  }, [initialData, form]);

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);

    try {
      const endpoint = isEditMode ? `/api/products/${initialData?.id}` : "/api/products";
      const method = isEditMode ? "PUT" : "POST";
      
      const payload = {
        ...data,
        imageUrl: data.imageUrl === "" ? null : data.imageUrl,
        description: data.description || null,
        price: data.price || null,
      };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`Produto ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
        form.reset(); 
        onClose(); 
      } else {
        const errorData = await response.json();
        console.error("Falha ao salvar produto:", errorData);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Produto" : "Novo Produto de Afiliado"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Nome do Produto</Label>
            <Input id="title" placeholder="Tênis de Corrida XYZ" {...form.register("title")} />
            {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
          </div>

          {/* URL Afiliado */}
          <div className="space-y-2">
            <Label htmlFor="affiliateUrl">Link de Afiliado (URL Completa)</Label>
            <Input id="affiliateUrl" placeholder="https://loja.com/produto?aff=123" {...form.register("affiliateUrl")} />
            {form.formState.errors.affiliateUrl && <p className="text-sm text-red-500">{form.formState.errors.affiliateUrl.message}</p>}
          </div>

          {/* URL Imagem */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem (Opcional)</Label>
            <Input id="imageUrl" placeholder="https://imagens.com/produto.jpg" {...form.register("imageUrl")} />
            {form.formState.errors.imageUrl && <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>}
          </div>

          {/* Preço e Descrição */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" placeholder="R$ 599,90" {...form.register("price")} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Descrição Curta</Label>
                <Input id="description" placeholder="Até 200 caracteres..." {...form.register("description")} />
            </div>
          </div>

          {/* Status Ativo */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Produto Ativo
              <p className="text-xs text-muted-foreground mt-1">Se desativado, não aparecerá na página pública.</p>
            </Label>
            <Switch
              id="active"
              checked={form.watch('active')}
              onCheckedChange={(val) => form.setValue('active', val, { shouldValidate: true })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isEditMode ? "Salvar Edição" : "Criar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}