"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface QrModalProps {
  username: string;
}

export const QrModal = ({ username }: QrModalProps) => {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/${username}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full" title="Gerar QR Code">
          <QrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Compartilhe seu perfil</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="p-4 bg-white border rounded-xl shadow-sm">
            <QRCode value={url} size={200} />
          </div>
          <p className="text-sm text-muted-foreground text-center break-all">
            {url}
          </p>
          <Button onClick={() => window.print()} variant="secondary" className="w-full">
            Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};