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
import { Coupon } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const couponSchema = z.object({
    storeName: z.string().min(2, "O nome da loja é obrigatório."),
    code: z.string().min(3, "O código do cupom deve ter pelo menos 3 caracteres.").max(30),
    discount: z.string().min(1, "O desconto é obrigatório (ex: 10% OFF).").max(20),
    link: z.string().url("A URL do link é inválida.").optional().or(z.literal("")),
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
                link: initialData.link || "", // Certifique-se de que link nunca seja null
                active: initialData.active,
            }
            : {
                storeName: "",
                code: "",
                discount: "",
                link: "", // Valor padrão vazio para link
                active: true,
            },
    });

    useEffect(() => {
        if (initialData) {
            // O reset só deve ser chamado se o formulário estiver sendo usado para edição.
            // Garantir que os dados iniciais correspondam à estrutura do formulário
            form.reset({
                ...initialData,
                // Garante que 'link' não seja 'null' se for a intenção, mas sim string vazia
                link: initialData.link ?? "",
            });
        }
    }, [initialData, form]);

    async function onSubmit(data: CouponFormValues) {
        setIsSubmitting(true);

        try {
            // Implementar a chamada PUT (edição) ou POST (criação)
            const endpoint = isEditMode ? `/api/coupons/${initialData?.id}` : "/api/coupons";
            const method = isEditMode ? "PUT" : "POST";
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    // Garante que string vazia seja null para o backend (se o schema Prisma permitir)
                    link: data.link || null,
                }),
            });

            if (response.ok) {
                // TODO: Mostrar Toast de sucesso
                console.log(`Cupom ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
                form.reset();
                onClose(true); // Fecha o modal e sinaliza que houve alteração
            } else {
                // TODO: Mostrar Toast de erro
                console.error("Falha ao salvar cupom:", await response.json());
            }
        } catch (error) {
            console.error("Erro de rede:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Editar Cupom" : "Adicionar Novo Cupom"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Nome da Loja */}
                    <div className="space-y-2">
                        <Label htmlFor="storeName">Nome da Loja/Marca</Label>
                        <Input id="storeName" placeholder="Centauro, Insider, etc." {...form.register("storeName")} />
                        {form.formState.errors.storeName && <p className="text-sm text-red-500">{form.formState.errors.storeName.message}</p>}
                    </div>

                    {/* Código do Cupom */}
                    <div className="space-y-2">
                        <Label htmlFor="code">Código do Cupom</Label>
                        <Input id="code" placeholder="LUISRUN10" {...form.register("code")} />
                        {form.formState.errors.code && <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>}
                    </div>

                    {/* Desconto */}
                    <div className="space-y-2">
                        <Label htmlFor="discount">Desconto Exibido</Label>
                        <Input id="discount" placeholder="10% OFF ou R$50 de desconto" {...form.register("discount")} />
                        {form.formState.errors.discount && <p className="text-sm text-red-500">{form.formState.errors.discount.message}</p>}
                    </div>

                    {/* Link Opcional */}
                    <div className="space-y-2">
                        <Label htmlFor="link">Link da Loja (Opcional)</Label>
                        <Input id="link" placeholder="https://loja.com" {...form.register("link")} />
                        {form.formState.errors.link && <p className="text-sm text-red-500">{form.formState.errors.link.message}</p>}
                    </div>

                    {/* Status Ativo */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <Label htmlFor="active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Cupom Ativo
                            <p className="text-xs text-muted-foreground mt-1">Se desativado, não aparecerá na página pública.</p>
                        </Label>
                        <Switch
                            id="active"
                            // Usar 'watch' é a maneira mais segura de ler o valor atual de um campo de formulário
                            checked={form.watch('active')}
                            onCheckedChange={(val) => form.setValue('active', val, { shouldValidate: true })}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onClose(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isEditMode ? "Salvar Edição" : "Criar Cupom"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}