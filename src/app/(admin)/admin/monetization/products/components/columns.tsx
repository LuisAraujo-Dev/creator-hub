"use client"

import { Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 shrink-0 rounded-lg"></div> 
        <div className="font-medium text-sm">
          {row.getValue("title")}
          <p className="text-xs text-muted-foreground">{row.original.price || 'Sem preço'}</p>
        </div>
      </div>
    ),
  },
  
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
        const isActive = row.getValue("active") as boolean
        return (
            <span 
                className={`px-3 py-1 text-xs font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
                {isActive ? 'Ativo' : 'Inativo'}
            </span>
        )
    }
  },

  {
    accessorKey: "affiliateUrl",
    header: "Link Afiliado",
    cell: ({ row }) => (
      <a 
        href={row.getValue("affiliateUrl")} 
        target="_blank" 
        className="text-blue-600 hover:underline text-xs truncate max-w-[150px] block"
      >
        {row.original.affiliateUrl.substring(0, 30)}...
      </a>
    ),
  },

  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.affiliateUrl)}
            >
              Copiar Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-blue-600">Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]