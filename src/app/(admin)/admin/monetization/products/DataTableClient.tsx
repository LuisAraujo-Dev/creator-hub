"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { ProductForm } from "./components/product-form";
import { DataTable } from "@/src/components/data-table";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface Props {
  data: Product[];
  columns: ColumnDef<Product>[];
}

export default function DataTableClient({ data, columns }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produtos ({data.length})</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie seus links de afiliados e recomendações.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>
      
      <Separator className="my-4" />

      <DataTable searchKey="title" columns={columns} data={data} />

      <ProductForm 
        isOpen={open} 
        onClose={handleClose} 
        initialData={null} 
      />
    </>
  );
}