"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Coupon } from "@prisma/client";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "storeName",
    header: "Loja",
  },
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => (
      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 border border-gray-200">
        {row.original.code}
      </span>
    )
  },
  {
    accessorKey: "discount",
    header: "Desconto",
  },
  {
    accessorKey: "clicks",
    header: "Cliques",
  },
  {
    accessorKey: "active",
    header: "Ativo",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full border ${
          row.original.active
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-red-50 text-red-700 border-red-200"
        }`}
      >
        {row.original.active ? "Ativo" : "Inativo"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];