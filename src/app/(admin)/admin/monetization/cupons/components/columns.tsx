"use client"

import { Partner } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Partner>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Parceiro
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-600 rounded-lg shrink-0 flex items-center justify-center text-white font-bold text-xs">
            {row.original.name.charAt(0)}
        </div> 
        <div className="font-medium text-gray-800 text-sm">
          {row.getValue("name")}
        </div>
      </div>
    ),
  },
  
  {
    accessorKey: "siteUrl",
    header: "URL do Site",
    cell: ({ row }) => {
        const url = row.getValue("siteUrl") as string;
        
        return (
            <a 
                href={url} 
                target="_blank" 
                className="flex items-center gap-1 text-blue-600 hover:underline text-xs truncate max-w-[150px]"
            >
                <Link size={14} />
                {url.replace(/^(https?:\/\/)?(www\.)?/, '').substring(0, 25)}...
            </a>
        )
    }
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
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const partner = row.original

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
              onClick={() => navigator.clipboard.writeText(partner.siteUrl)}
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