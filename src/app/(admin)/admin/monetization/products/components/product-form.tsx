//src/app/(admin)/admin/monetization/products/components/product-form.tsx
"use client";

import { Button } from "@/components/ui/button";


import { Product } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; 
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ImageUpload } from "@/components/ui/image-upload";
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
        toast.success(isEditMode ? "Produto atualizado!" : "Produto criado!");
        form.reset(); 
        onClose(); 
      } else {
        const error = await response.json();
        console.error(error);
        toast.error("Erro ao salvar. Verifique os dados.");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
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
            <SheetTitle>{isEditMode ? "Editar Produto" : "Novo Produto"}</SheetTitle>
            <SheetDescription>
                {isEditMode ? "Faça alterações no seu produto." : "Adicione um novo link de afiliado."}
            </SheetDescription>
            </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-2">
                <Label htmlFor="title">Nome do Produto</Label>
                <Input id="title" placeholder="Ex: Tênis de Corrida XYZ" {...form.register("title")} />
                {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="affiliateUrl">Link de Afiliado</Label>
                <Input id="affiliateUrl" placeholder="https://loja.com/..." {...form.register("affiliateUrl")} />
                {form.formState.errors.affiliateUrl && <p className="text-xs text-red-500">{form.formState.errors.affiliateUrl.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Imagem</Label>
                <div className="flex justify-center border rounded-md p-4 bg-gray-50/50">
                    <ImageUpload
                        value={form.watch("imageUrl") || ""}
                        onChange={(url) => form.setValue("imageUrl", url, { shouldValidate: true })}
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Preço</Label>
                    <Input id="price" placeholder="R$ 599,90" {...form.register("price")} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input id="description" placeholder="Breve descrição..." {...form.register("description")} />
                </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                <Label htmlFor="active" className="text-sm font-medium cursor-pointer flex flex-col">
                    <span>Ativo</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Visível publicamente</span>
                </Label>
                <Switch
                    id="active"
                    checked={form.watch('active')}
                    onCheckedChange={(val) => form.setValue('active', val, { shouldValidate: true })}
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
                    {isEditMode ? "Salvar Alterações" : "Criar Produto"}
                </Button>
            </SheetFooter>
        </div>

      </SheetContent>
    </Sheet>
  );
}