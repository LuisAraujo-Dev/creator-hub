"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Trash, Copy, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";

import { Button } from "@/components/ui/button";
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

interface CellActionProps {
  data: Product;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false); 
  const [openEdit, setOpenEdit] = useState(false);   
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      await fetch(`/api/products/${data.id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };

  const onCopyLink = () => {
    navigator.clipboard.writeText(data.affiliateUrl);
  };

  return (
    <>
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Produto?</DialogTitle>
            <DialogDescription>
              O produto <span className="font-bold">{data.title}</span> será removido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={loading}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProductForm 
        isOpen={openEdit}
        onClose={() => {
            setOpenEdit(false);
            router.refresh();
        }}
        initialData={data}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={onCopyLink}>
            <Copy className="mr-2 h-4 w-4" /> Copiar Link
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => window.open(data.affiliateUrl, '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" /> Ver na Loja
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Edit className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-destructive focus:text-destructive">
            <Trash className="mr-2 h-4 w-4" /> Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};