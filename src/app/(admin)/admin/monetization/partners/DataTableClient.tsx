// src/app/(admin)/admin/monetization/partners/DataTableClient.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Partner } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PartnerForm } from "./components/partner-form";
import { DataTable } from "@/components/data-table";


interface Props {
  data: Partner[];
  columns: ColumnDef<Partner>[];
}

export default function DataTableClient({ data, columns }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Parceiros ({data.length})</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie seus patrocinadores e marcas parceiras.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Parceiro
        </Button>
      </div>
      
      <Separator className="my-4" />

      <DataTable searchKey="name" columns={columns} data={data} />

      <PartnerForm 
        isOpen={open} 
        onClose={() => { setOpen(false); router.refresh(); }} 
        initialData={null} 
      />
    </>
  );
}