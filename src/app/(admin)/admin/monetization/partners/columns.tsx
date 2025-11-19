"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Partner } from "@prisma/client";
import { CellAction } from "./cell-action";
import { Check, X } from "lucide-react";
import Image from "next/image";

export const columns: ColumnDef<Partner>[] = [
  {
    accessorKey: "logoUrl",
    header: "Logo",
    cell: ({ row }) => (
      <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100 border">
        {row.original.logoUrl ? (
          <Image src={row.original.logoUrl} alt={row.original.name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-xs font-bold text-gray-400">
            {row.original.name.charAt(0)}
          </div>
        )}
      </div>
    )
  },
  {
    accessorKey: "name",
    header: "Parceiro",
  },
  {
    accessorKey: "clicks",
    header: "Cliques",
  },
  {
    accessorKey: "active",
    header: "Ativo",
    cell: ({ row }) => (
      row.original.active ? 
      <Check className="h-4 w-4 text-green-500" /> : 
      <X className="h-4 w-4 text-red-500" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];