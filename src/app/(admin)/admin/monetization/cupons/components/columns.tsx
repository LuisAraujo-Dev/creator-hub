import { ColumnDef } from "@tanstack/react-table";
import { Coupon } from "@prisma/client";

export const columns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "storeName",
    header: "Loja",
  },
  {
    accessorKey: "code",
    header: "Código",
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
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.original.active
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.active ? "Sim" : "Não"}
      </span>
    ),
  },
];
