"use client";

import { useState, useEffect } from "react";
import { Copy, Share2, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const ShareModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !username) {
      setLoading(true);
      axios.get("/api/profile")
        .then((res) => setUsername(res.data.username))
        .catch(() => toast.error("Erro ao carregar perfil"))
        .finally(() => setLoading(false));
    }
  }, [isOpen, username]);

  const url = typeof window !== "undefined" 
    ? `${window.location.origin}/${username}` 
    : `https://creatorhub.app/${username}`;

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copiado para a área de transferência!");
  };

  const onShareWhatsapp = () => {
    const text = `Confira meus links e conteúdos exclusivos no CreatorHub! 👇\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Compartilhar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhe sua página</DialogTitle>
          <DialogDescription>
            Envie seu link para sua audiência ou adicione na bio do Instagram.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="flex flex-col gap-6 py-4">
            
            {/* ÁREA DO LINK */}
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-1">
                <Label htmlFor="link" className="sr-only">Link</Label>
                <Input id="link" value={url} readOnly className="bg-slate-50 h-9" />
              </div>
              <Button type="button" size="sm" className="px-3" onClick={onCopy}>
                <span className="sr-only">Copiar</span>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* BOTÕES RÁPIDOS */}
            <div className="grid grid-cols-2 gap-3">
                <Button onClick={onShareWhatsapp} variant="outline" className="gap-2 border-green-200 hover:bg-green-50 text-green-700">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>
                <Button onClick={() => window.open(url, "_blank")} variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" /> Abrir Página
                </Button>
            </div>

            {/* QR CODE */}
            <div className="flex flex-col items-center justify-center pt-2 border-t">
                <span className="text-xs text-muted-foreground mb-3 uppercase font-bold tracking-widest">QR Code</span>
                <div className="p-3 bg-white border rounded-xl shadow-sm">
                    <QRCode value={url} size={140} />
                </div>
                <Button 
                    onClick={() => window.print()} 
                    variant="link" 
                    className="text-xs text-muted-foreground mt-1 h-auto p-0"
                >
                    Imprimir para colocar na mesa
                </Button>
            </div>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};