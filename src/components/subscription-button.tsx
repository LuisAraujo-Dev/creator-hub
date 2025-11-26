"use client";

import { useState } from "react";
import axios from "axios";
import { Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubscriptionButtonProps {
  isPro: boolean;
}

export const SubscriptionButton = ({ isPro = false }: SubscriptionButtonProps) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      
      window.location.href = response.data.url;
    } catch (error) {
      console.log(error);
      toast.error("Erro ao conectar com o Stripe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="default" 
      onClick={onClick} 
      disabled={loading}
      className={!isPro ? "bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0" : ""}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && !isPro && <Zap className="w-4 h-4 mr-2 fill-current" />}
      {isPro ? "Gerenciar Assinatura" : "Fazer Upgrade para PRO"}
    </Button>
  );
};