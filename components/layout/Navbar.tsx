"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, ShieldCheck, PhoneCall } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { defaultStoreConfig } from "@/lib/config/store.config";
import { formatCurrency } from "@/lib/utils";
import { SmashLegendLogo } from "@/components/ui/SmashLegendLogo";

export function Navbar() {
  const { getItemsCount, getSubtotal, setIsCartOpen } = useCartStore();
  const itemsCount = getItemsCount();
  const subtotal = getSubtotal();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2A2A2A] bg-[#080808]/95 backdrop-blur supports-[backdrop-filter]:bg-[#080808]/85">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Brand with Official Smash Legend Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <SmashLegendLogo size="sm" showSubtitle={true} />
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* WhatsApp Direct button */}
          <a
            href={`https://wa.me/${defaultStoreConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] bg-[#161616] px-2.5 py-1.5 text-xs font-semibold text-[#25D366] hover:bg-[#1E1E1E] transition-colors"
            title="WhatsApp Smash Legend"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>(11) 94564-9048</span>
          </a>

          {/* Admin link */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] bg-[#1C1C1C] px-2.5 py-1.5 text-xs font-medium text-[#C4B59D] hover:text-white hover:border-[#FF7A00]/50 transition-colors"
            title="Painel Administrativo"
          >
            <ShieldCheck className="h-4 w-4 text-[#FF7A00]" />
            <span className="hidden md:inline">Admin</span>
          </Link>

          {/* Cart Floating Button / Header Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-xl bg-[#FF7A00] hover:bg-[#E56A00] text-black px-3 sm:px-4 py-2 font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] active:scale-95"
            aria-label="Abrir carrinho"
          >
            <ShoppingBag className="h-5 w-5 text-black" />
            <div className="flex flex-col text-left leading-none">
              <span className="font-bebas text-sm sm:text-base tracking-wide text-black">
                {itemsCount > 0 ? `${itemsCount} ${itemsCount === 1 ? "item" : "itens"}` : "Carrinho"}
              </span>
              {itemsCount > 0 && (
                <span className="text-[11px] font-bold text-black/90">
                  {formatCurrency(subtotal)}
                </span>
              )}
            </div>

            {itemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#E6391F] text-[10px] font-bold text-white shadow-md border-2 border-[#080808]">
                {itemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
