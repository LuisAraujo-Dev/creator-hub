//src/app/(admin)/admin/monetization/coupons/DataTableClient.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Coupon } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { CouponForm } from "./components/coupon-form";
import { columns } from "./components/columns"; 
import { Separator } from "../../../../../components/ui/separator";
import { DataTable } from "@/components/data-table";

interface Props {
  data: Coupon[];
}

export default function DataTableClient({ data }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClose = (didSave?: boolean) => {
    setOpen(false);
    if (didSave) {
      router.refresh();
    }
  };

  const safeData = data || [];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cupons ({safeData.length})</h2>
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

      <DataTable searchKey="storeName" columns={columns} data={safeData} />

      <CouponForm 
        isOpen={open} 
        onClose={handleClose} 
        initialData={null} 
      />
    </>
  );
}