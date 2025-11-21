//src/app/(admin)/layout.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isActiveLink = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(path);
  };

  const getLinkClass = (path: string) => {
    const active = isActiveLink(path);
    return cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
      active 
        ? "bg-blue-100 text-blue-700 shadow-sm" 
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900" 
    );
  };

  const handleLogout = () => {
    toast.success("Você saiu do sistema.");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 shrink-0 cursor-default">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                C
              </div>
              <span className="text-lg font-bold tracking-tight hidden md:block">CreatorHub</span>
            </div>

            <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar py-1 px-2 max-w-full">
              <Link href="/admin" className={getLinkClass("/admin")} title="Dashboard">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <Link href="/admin/monetization/products" className={getLinkClass("/admin/monetization/products")} title="Produtos">
                <ShoppingBag size={18} />
                <span className="hidden md:inline">Produtos</span>
              </Link>
              <Link href="/admin/monetization/cupons" className={getLinkClass("/admin/monetization/cupons")} title="Cupons">
                <Tag size={18} />
                <span className="hidden md:inline">Cupons</span>
              </Link>
              <Link href="/admin/monetization/partners" className={getLinkClass("/admin/monetization/partners")} title="Parceiros">
                <Handshake size={18} />
                <span className="hidden md:inline">Parceiros</span>
              </Link>
            </nav>

            <div className="flex items-center gap-1 shrink-0">
               <Link 
                  href="/luisrun" 
                  target="_blank" 
                  className="hidden sm:flex items-center gap-2 text-xs font-medium text-blue-600 hover:underline bg-blue-50 px-3 py-1.5 rounded-full mr-2 border border-blue-100"
               >
                  <ExternalLink size={14} /> <span className="hidden lg:inline">Ver página</span>
               </Link>

               <Link href="/admin/profile" className={cn("p-2 rounded-full transition", isActiveLink("/admin/profile") ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-100")} title="Perfil">
                  <User size={20} />
               </Link>
               <Link href="/admin/settings" className={cn("p-2 rounded-full transition", isActiveLink("/admin/settings") ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-100")} title="Configurações">
                  <Settings size={20} />
               </Link>
               <button 
                 onClick={handleLogout}
                 className="p-2 text-red-500 hover:bg-red-50 rounded-full transition" 
                 title="Sair"
               >
                  <LogOut size={20} />
               </button>
            </div>

          </div>
        </div>
      </header>

      <main className="flex-1 w-full bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
        </div>
      </main>
    </div>
  );
}