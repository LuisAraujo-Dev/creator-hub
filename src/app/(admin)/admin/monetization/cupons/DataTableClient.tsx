"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Coupon } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { CouponForm } from "./components/coupon-form";
import { DataTable } from "@/src/components/data-table";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface Props {
  data: Coupon[];
  columns: ColumnDef<Coupon>[];
}

export default function DataTableClient({ data, columns }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Função para fechar o modal e atualizar a lista se salvou
  const handleClose = (didSave?: boolean) => {
    setOpen(false);
    if (didSave) {
      router.refresh(); // Recarrega os dados do servidor
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cupons ({data.length})</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie códigos de desconto e parcerias para sua audiência.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cupom
        </Button>
      </div>
      
      <Separator className="my-4" />

      <DataTable searchKey="storeName" columns={columns} data={data} />

      <CouponForm 
        isOpen={open} 
        onClose={handleClose} 
        initialData={null} 
      />
    </>
  );
}