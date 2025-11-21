//src/app/(admin)/admin/monetization/products/DataTableClient.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { ProductForm } from "./components/product-form";
import { columns } from "./components/columns"; 
import { Separator } from "../../../../../components/ui/separator";
import { DataTable } from "@/components/data-table";

interface Props {
  data: Product[];
}

export default function DataTableClient({ data }: Props) {
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