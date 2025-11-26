"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Coupon } from "@prisma/client";

interface ThemeStyles {
  bgClass: string;
  textClass: string;
  cardClass: string;
  buttonClass: string;
}

interface PublicCouponCardProps {
  coupon: Coupon;
  theme: ThemeStyles;
  themeKey: string;
  themeColor: string;
}

export function PublicCouponCard({ coupon, theme, themeKey, themeColor }: PublicCouponCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleInteraction = async (e: React.MouseEvent) => {
    
    try {
      await navigator.clipboard.writeText(coupon.code);
      setIsCopied(true);
      toast.success("Cupom copiado: " + coupon.code);
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar", err);
    }

    try {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: coupon.id, type: "coupon" }),
        keepalive: true,
      });
    } catch (err) {
      console.error("Erro de tracking", err);
    }

    if (coupon.link) {
        setTimeout(() => {
            window.open(coupon.link!, "_blank");
        }, 300);
    }
  };

  const isLightTheme = themeKey === "light";

  return (
    <div 
        onClick={handleInteraction}
        className={`relative overflow-hidden rounded-xl transition-all cursor-pointer group active:scale-[0.98] ${theme.cardClass}`}
    >
        {/* Barra lateral de cor */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1.5" 
          style={{ backgroundColor: themeColor }}
        />
        
        <div className="p-4 pl-5 flex justify-between items-center gap-3">
            <div className="flex flex-col min-w-0">
                <span className={`font-bold text-sm truncate ${theme.textClass}`}>
                    {coupon.storeName}
                </span>
                <span className={`text-xs font-medium mt-0.5 truncate ${isLightTheme ? 'text-gray-500' : 'text-white/70'}`}>
                  {coupon.discount}
                </span>
            </div>
            
            {/* Área do Código + Botão */}
            <div 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors group-hover:border-opacity-100 border-opacity-50`}
              style={{ 
                  borderColor: isLightTheme ? '#e5e7eb' : 'rgba(255,255,255,0.2)',
                  backgroundColor: isLightTheme ? '#f9fafb' : 'rgba(255,255,255,0.1)'
              }}
            >
                <span 
                    className="text-xs font-mono font-bold uppercase tracking-wider"
                    style={{ color: themeColor }}
                >
                    {coupon.code}
                </span>
                
                <div className={`pl-2 border-l ${isLightTheme ? 'border-gray-200' : 'border-white/10'}`}>
                    {isCopied ? (
                        <Check className="w-4 h-4 text-green-500 animate-in zoom-in duration-200" />
                    ) : (
                        <Copy className={`w-4 h-4 transition-colors ${isLightTheme ? 'text-gray-400 group-hover:text-gray-600' : 'text-white/40 group-hover:text-white'}`} />
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}