"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "../../../lib/utils"


const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      // Define o container como um botão pílula
      "group peer inline-flex h-7 min-w-[70px] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      // Cores para Ativo (Verde) e Inativo (Cinza)
      "data-[state=checked]:bg-green-600",
      "data-[state=unchecked]:bg-slate-200",
      className
    )}
    {...props}
    ref={ref}
  >
    {/* Texto que aparece quando está ATIVO */}
    <span className="text-[10px] font-bold uppercase text-white group-data-[state=unchecked]:hidden">
      Ativo
    </span>

    {/* Texto que aparece quando está INATIVO */}
    <span className="text-[10px] font-bold uppercase text-slate-500 group-data-[state=checked]:hidden">
      Inativo
    </span>
    
    {/* O Thumb é necessário para o Radix funcionar, mas deixamos oculto visualmente */}
    <SwitchPrimitive.Thumb className="hidden" />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }