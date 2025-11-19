"use client";

import { ReactNode } from "react";

interface LinkTrackerProps {
  id: string;
  type: "product" | "coupon" | "partner";
  url?: string | null;
  code?: string | null; 
  children: ReactNode;
  className?: string;
}

export default function LinkTracker({ 
  id, 
  type, 
  url, 
  code, 
  children, 
  className 
}: LinkTrackerProps) {

  const handleClick = async (e: React.MouseEvent) => {
    if (type === "coupon" && code) {
      e.preventDefault(); 
      navigator.clipboard.writeText(code);
      if (url) window.open(url, "_blank"); 
    }

    try {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
        keepalive: true, 
      });
    } catch (err) {
      console.error("Erro ao trackear clique", err);
    }
  };

  if (type === "coupon" || !url) {
    return (
      <div onClick={handleClick} className={className}>
        {children}
      </div>
    );
  }

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}