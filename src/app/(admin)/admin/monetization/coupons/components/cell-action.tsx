"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Trash, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Coupon } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";



import { CouponForm } from "./coupon-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../../components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";


interface CellActionProps {
  data: Coupon;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCopyCode = () => {
    navigator.clipboard.writeText(data.code);
    toast.success("Código do cupom copiado!");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/coupons/${data.id}`);
      toast.success("Cupom removido com sucesso.");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao remover o cupom.");
      console.error(error);
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };

  return (
    <>
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Cupom?</DialogTitle>
            <DialogDescription>
              O cupom <span className="font-bold text-red-600">{data.code}</span> será removido permanentemente.
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

      {/* 2. Modal de Edição (Reutiliza o CouponForm com Sheet) */}
      <CouponForm 
        isOpen={openEdit}
        onClose={(didSave) => {
            setOpenEdit(false);
            if (didSave) router.refresh();
        }}
        initialData={data}
      />

      {/* 3. Menu Dropdown da Tabela */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-black">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={onCopyCode} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" /> Copiar Código
          </DropdownMenuItem>

          {/* Só mostra link externo se o cupom tiver link */}
          {data.link && (
            <DropdownMenuItem onClick={() => window.open(data.link!, '_blank')} className="cursor-pointer">
                <ExternalLink className="mr-2 h-4 w-4" /> Visitar Loja
            </DropdownMenuItem>
          )}

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