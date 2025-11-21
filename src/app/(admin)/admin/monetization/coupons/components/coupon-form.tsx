//src/app/(admin)/admin/monetization/coupons/components/coupon-form.tsx
"use client";

import { Button } from "@/components/ui/button";


import { Coupon } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "../../../../../../components/ui/label";
import { Input } from "../../../../../../components/ui/input";
import { Switch } from "@radix-ui/react-switch";

const couponSchema = z.object({
  storeName: z.string().min(2, "O nome da loja é obrigatório."),
  code: z.string().min(3, "O código deve ter pelo menos 3 caracteres.").max(30),
  discount: z.string().min(1, "O desconto é obrigatório (ex: 10% OFF).").max(20),
  link: z.string().url("A URL é inválida.").optional().or(z.literal("")),
  active: z.boolean(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponFormProps {
  isOpen: boolean;
  onClose: (didSave?: boolean) => void;
  initialData?: Coupon | null;
}

export function CouponForm({ isOpen, onClose, initialData }: CouponFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData;

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: initialData
      ? {
          storeName: initialData.storeName,
          code: initialData.code,
          discount: initialData.discount,
          link: initialData.link || "",
          active: initialData.active,
        }
      : {
          storeName: "",
          code: "",
          discount: "",
          link: "",
          active: true,
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        storeName: initialData.storeName,
        code: initialData.code,
        discount: initialData.discount,
        link: initialData.link || "",
        active: initialData.active,
      });
    } else {
      form.reset({
        storeName: "",
        code: "",
        discount: "",
        link: "",
        active: true,
      });
    }
  }, [initialData, form]);

  async function onSubmit(data: CouponFormValues) {
    setIsSubmitting(true);

    try {
      const endpoint = isEditMode ? `/api/coupons/${initialData?.id}` : "/api/coupons";
      const method = isEditMode ? "PUT" : "POST";
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          link: data.link || null,
        }),
      });

      if (response.ok) {
        toast.success(isEditMode ? "Cupom atualizado!" : "Cupom criado!");
        form.reset();
        onClose(true); // Passa true para indicar que salvou
      } else {
        const error = await response.json();
        console.error(error);
        toast.error("Erro ao salvar cupom.");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      toast.error("Erro de conexão.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={() => onClose(false)}>
      <SheetContent side="right" className="sm:max-w-lg w-full p-0 flex flex-col bg-white h-full">
        
        <div className="p-6 border-b border-gray-100">
            <SheetHeader>
            <SheetTitle>{isEditMode ? "Editar Cupom" : "Novo Cupom"}</SheetTitle>
            <SheetDescription>
                {isEditMode ? "Faça alterações no seu cupom de desconto." : "Crie um novo código de desconto para sua audiência."}
            </SheetDescription>
            </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <form id="coupon-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja/Marca</Label>
                <Input id="storeName" placeholder="Ex: Centauro, Insider..." {...form.register("storeName")} />
                {form.formState.errors.storeName && <p className="text-xs text-red-500">{form.formState.errors.storeName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="code">Código do Cupom</Label>
                    <Input id="code" placeholder="LUIS10" className="font-mono uppercase" {...form.register("code")} />
                    {form.formState.errors.code && <p className="text-xs text-red-500">{form.formState.errors.code.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="discount">Desconto</Label>
                    <Input id="discount" placeholder="10% OFF" {...form.register("discount")} />
                    {form.formState.errors.discount && <p className="text-xs text-red-500">{form.formState.errors.discount.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="link">Link da Loja (Opcional)</Label>
                <Input id="link" placeholder="https://loja.com/..." {...form.register("link")} />
                {form.formState.errors.link && <p className="text-xs text-red-500">{form.formState.errors.link.message}</p>}
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
                <Button type="button" variant="outline" onClick={() => onClose(false)} className="w-full sm:w-auto">
                    Cancelar
                </Button>
                <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isEditMode ? "Salvar Alterações" : "Criar Cupom"}
                </Button>
            </SheetFooter>
        </div>

      </SheetContent>
    </Sheet>
  );
}