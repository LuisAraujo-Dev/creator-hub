import Link from "next/link";
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-bold text-lg tracking-tight">CreatorHub</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link 
            href="/admin/profile" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition"
          >
            <User size={18} />
            Meu Perfil
          </Link>
          
          <div className="pt-4 pb-1 px-3 text-xs font-semibold uppercase text-gray-400">
            Monetização
          </div>

          <Link 
            href="/admin/monetization/products" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition"
          >
            <ShoppingBag size={18} />
            Recomendações
          </Link>

          <Link 
            href="/admin/monetization/cupons" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition"
          >
            <Tag size={18} />
            Cupons
          </Link>

          <Link 
            href="/admin/monetization/partners" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition"
          >
            <Handshake size={18} />
            Parceiros
          </Link>

          <div className="pt-4 pb-1 px-3 text-xs font-semibold uppercase text-gray-400">
            Sistema
          </div>

          <Link 
            href="/admin/settings" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition"
          >
            <Settings size={18} />
            Configurações
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link 
             href="/luisrun" 
             target="_blank"
             className="flex items-center gap-2 text-xs text-blue-600 mb-4 hover:underline"
          >
            <ExternalLink size={14} />
            Ver minha página
          </Link>
          
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition w-full">
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}