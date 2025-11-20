"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ShoppingBag, 
  Tag, 
  Handshake
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Função para estilizar links
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
      isActive 
        ? "bg-blue-50 text-blue-600" 
        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* HEADER FIXO E HORIZONTAL (Responsivo sem Hambúrguer) */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* LADO ESQUERDO: LOGO */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                C
              </div>
              <span className="text-lg font-bold tracking-tight hidden md:block">CreatorHub</span>
            </div>

            {/* CENTRO: NAVEGAÇÃO PRINCIPAL (Scroll horizontal se necessário) */}
            <nav className="flex items-center gap-1 flex-1 justify-center overflow-x-auto no-scrollbar">
              <Link href="/admin" className={getLinkClass("/admin")} title="Dashboard">
                <LayoutDashboard size={20} />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <Link href="/admin/monetization/products" className={getLinkClass("/admin/monetization/products")} title="Produtos">
                <ShoppingBag size={20} />
                <span className="hidden md:inline">Produtos</span>
              </Link>
              <Link href="/admin/monetization/coupons" className={getLinkClass("/admin/monetization/coupons")} title="Coupons">
                <Tag size={20} />
                <span className="hidden md:inline">Cupons</span>
              </Link>
              <Link href="/admin/monetization/partners" className={getLinkClass("/admin/monetization/partners")} title="Parceiros">
                <Handshake size={20} />
                <span className="hidden md:inline">Parceiros</span>
              </Link>
            </nav>

            {/* LADO DIREITO: AÇÕES DO USUÁRIO */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
               {/* Botão "Ver Página" (Escondido em telas muito pequenas pra economizar espaço) */}
               <Link 
                  href="/luisrun" 
                  target="_blank" 
                  className="hidden sm:flex items-center gap-2 text-xs font-medium text-blue-600 hover:underline bg-blue-50 px-3 py-1.5 rounded-full mr-2"
               >
                  <ExternalLink size={14} /> <span className="hidden lg:inline">Ver página</span>
               </Link>

               <Link href="/admin/profile" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition" title="Perfil">
                  <User size={20} />
               </Link>
               <Link href="/admin/settings" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition" title="Configurações">
                  <Settings size={20} />
               </Link>
               <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition" title="Sair">
                  <LogOut size={20} />
               </button>
            </div>

          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 w-full bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
        </div>
      </main>
    </div>
  );
}