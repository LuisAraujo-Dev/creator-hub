"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Trash, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import { Button } from "@/src/components/ui/button";

interface CellActionProps {
  data: Product;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // Copiar ID ou Link
  const onCopyLink = () => {
    navigator.clipboard.writeText(data.affiliateUrl);
    toast.success("Link de afiliado copiado!");
  };

  // Deletar Produto
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/products/${data.id}`);
      toast.success("Produto removido com sucesso.");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao remover o produto.");
      console.error(error);
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };

  return (
    <>
      {/* 1. Modal de Confirmação de Exclusão (Dialog Centralizado) */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Produto?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O produto <span className="font-bold text-red-600">{data.title}</span> será removido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Formulário de Edição (Sheet Lateral) */}
      {/* Renderizamos condicionalmente ou apenas controlamos pelo isOpen */}
      <ProductForm 
        isOpen={openEdit}
        onClose={() => {
            setOpenEdit(false);
            // Opcional: router.refresh() aqui se quiser garantir dados frescos ao fechar sem salvar
        }}
        initialData={data}
      />

      {/* 3. Menu de Ações (Dropdown) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-black">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={onCopyLink} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" /> Copiar Link
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => window.open(data.affiliateUrl, '_blank')} className="cursor-pointer">
            <ExternalLink className="mr-2 h-4 w-4" /> Ver na Loja
          </DropdownMenuItem>

          {/* Separador visual */}
          <div className="h-px bg-gray-100 my-1" />

          <DropdownMenuItem onClick={() => setOpenEdit(true)} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => setOpenDelete(true)} 
            className="text-red-600 focus:text-red-600 cursor-pointer focus:bg-red-50"
          >
            <Trash className="mr-2 h-4 w-4" /> Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};