export const THEMES = {
  light: {
    label: "Claro (Padrão)",
    type: "free",
    bgClass: "bg-gray-50",
    textClass: "text-slate-900",
    cardClass: "bg-white border-gray-200 shadow-sm",
    buttonClass: "bg-slate-900 text-white hover:bg-slate-800",
  },
  dark: {
    label: "Escuro (Dark)",
    type: "free",
    bgClass: "bg-slate-950",
    textClass: "text-slate-50",
    cardClass: "bg-slate-900 border-slate-800 shadow-none",
    buttonClass: "bg-white text-slate-950 hover:bg-gray-200",
  },
  // --- TEMAS PRO ---
  sunset: {
    label: "Sunset (Pro)",
    type: "pro",
    bgClass: "bg-gradient-to-br from-orange-500 to-pink-600",
    textClass: "text-white",
    cardClass: "bg-white/10 backdrop-blur-md border-white/20 shadow-lg",
    buttonClass: "bg-white text-orange-600 hover:bg-orange-50",
  },
  ocean: {
    label: "Ocean (Pro)",
    type: "pro",
    bgClass: "bg-gradient-to-br from-blue-600 to-teal-400",
    textClass: "text-white",
    cardClass: "bg-white/10 backdrop-blur-md border-white/20 shadow-lg",
    buttonClass: "bg-white text-blue-600 hover:bg-blue-50",
  },
  midnight: {
    label: "Midnight (Pro)",
    type: "pro",
    bgClass: "bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900",
    textClass: "text-purple-50",
    cardClass: "bg-black/40 backdrop-blur-md border-purple-500/30",
    buttonClass: "bg-purple-500 text-white hover:bg-purple-600",
  }
};

export type ThemeKey = keyof typeof THEMES;