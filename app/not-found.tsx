import React from "react";
import Link from "next/link";
import { Home, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#F3E3C7] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6 text-center space-y-4 shadow-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-950/50 border border-orange-500/30 text-[#FF7A00] mx-auto">
          <Flame className="h-7 w-7" />
        </div>

        <h2 className="font-bebas text-3xl text-white tracking-wide">
          Página Não Encontrada
        </h2>

        <p className="text-xs text-[#C4B59D]">
          O endereço acessado não existe ou foi movido.
        </p>

        <div className="pt-2">
          <Link href="/">
            <Button className="flex items-center gap-2 bg-[#FF7A00] hover:bg-[#E56A00] text-black font-bold mx-auto">
              <Home className="h-4 w-4" />
              <span>Voltar ao Cardápio</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
