"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#080808] text-[#F3E3C7] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6 text-center space-y-4 shadow-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-950/50 border border-red-500/30 text-red-400 mx-auto">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide">
          Algo deu errado
        </h2>

        <p className="text-xs text-[#C4B59D] leading-relaxed">
          Ocorreu uma instabilidade temporária. Clique no botão abaixo para recarregar o cardápio da Smash Legend.
        </p>

        <div className="flex gap-3 justify-center pt-2">
          <Button
            onClick={() => reset()}
            className="flex items-center gap-2 bg-[#FF7A00] hover:bg-[#E56A00] text-black font-bold"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Tentar Novamente</span>
          </Button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#1C1C1C] px-4 py-2.5 text-xs font-semibold text-[#F3E3C7] hover:bg-[#252525]"
          >
            <Home className="h-4 w-4" />
            <span>Início</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
