// src/app/onboarding/page.tsx  
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  username: z.string()
    .min(3, "Mínimo 3 caracteres")
    .regex(/^[a-z0-9-_]+$/, "Apenas letras minúsculas, números e -")
    .transform(val => val.toLowerCase()),
});

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await axios.post("/api/onboarding", values);
      
      toast.success("Conta criada com sucesso!");
      window.location.href = "/admin"; 
      
    } catch (error: any) {
      if (error.response?.status === 409) {
        form.setError("username", { message: "Este link já está em uso." });
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-600/20">
            <Sparkles size={24} />
          </div>
          <CardTitle className="text-2xl font-bold">Bem-vindo, {user?.firstName}!</CardTitle>
          <CardDescription>
            Vamos configurar seu link exclusivo para começar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Escolha seu usuário
              </label>
              <div className="flex items-center">
                <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-gray-500 text-sm h-10 flex items-center">
                  creatorhub.com/
                </span>
                <Input 
                  {...form.register("username")}
                  placeholder="seu-nome" 
                  className="rounded-l-none focus-visible:ring-0 border-l-0 pl-2 h-10"
                  autoFocus
                  disabled={isLoading}
                />
              </div>
              {form.formState.errors.username && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {form.formState.errors.username.message}
                </p>
              )}
              <p className="text-[11px] text-gray-400 ml-1">
                Este será o link que você compartilhará na bio.
              </p>
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Criar minha página <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}