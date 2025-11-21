//src/app/(admin)/admin/monetization/products/components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@prisma/client";
import { Check, X, ExternalLink } from "lucide-react";
import Image from "next/image";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "imageUrl",
    header: "Imagem",
    cell: ({ row }) => (
      <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100 border">
        {row.original.imageUrl ? (
          <Image 
            src={row.original.imageUrl} 
            alt={row.original.title} 
            fill 
            className="object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <ExternalLink size={16} />
          </div>
        )}
      </div>
    )
  },
  {
    accessorKey: "title",
    header: "Produto",
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => row.original.price || "-", 
  },
  {
    accessorKey: "clicks",
    header: "Cliques",
  },
  {
    accessorKey: "active",
    header: "Ativo",
    cell: ({ row }) => (
      <div className="flex items-center">
        {row.original.active ? (
          <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3" /> Ativo
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
            <X className="w-3 h-3" /> Inativo
          </span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];