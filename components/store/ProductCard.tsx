"use client";

import React, { useState } from "react";
import { Plus, Clock, Sparkles } from "lucide-react";
import { Product } from "@/types/store";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const isDrink = product.categoryId === "bebidas";

  return (
    <div
      onClick={() => product.isAvailable && onSelect(product)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#161616] p-3 sm:p-4 transition-all duration-200 ${
        product.isAvailable
          ? "hover:border-[#FF6A00]/50 hover:bg-[#1C1C1C] cursor-pointer hover:shadow-glow"
          : "opacity-60 cursor-not-allowed"
      }`}
    >
      <div className="space-y-3">
        {/* Image Container with Custom Ratios to avoid cutting bottles and burgers */}
        <div
          className={`relative w-full overflow-hidden rounded-xl border border-[#262626]/70 transition-all ${
            isDrink
              ? "aspect-square bg-[radial-gradient(ellipse_at_center,_#262626_0%,_#111111_70%,_#070707_100%)] flex items-center justify-center p-3"
              : "aspect-[4/3] bg-[#0F0F0F] flex items-center justify-center"
          }`}
        >
          <img
            src={imgError ? "/assets/aistudio/smashes_logo_a4050271.webp" : product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className={`h-full w-full transition-transform duration-300 group-hover:scale-105 ${
              isDrink
                ? "object-contain max-h-full max-w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)] filter contrast-105"
                : "object-cover object-center"
            }`}
            loading="lazy"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
            {product.badge && (
              <Badge variant="fire" className="text-[10px] shadow-md">
                {product.badge}
              </Badge>
            )}
            {!product.isAvailable && (
              <Badge variant="destructive" className="text-[10px] shadow-md">
                Esgotado
              </Badge>
            )}
          </div>

          {product.preparationTime && (
            <div className="absolute bottom-2 right-2 rounded-md bg-[#080808]/85 px-2 py-0.5 text-[10px] font-medium text-[#C4B59D] backdrop-blur flex items-center gap-1 border border-white/5">
              <Clock className="h-3 w-3 text-[#FF6A00]" />
              {product.preparationTime}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <h3 className="font-bebas text-xl sm:text-2xl text-white tracking-wide group-hover:text-[#FF6A00] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#C4B59D] line-clamp-2 leading-relaxed min-h-[32px]">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer / Price & Add */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#2A2A2A]/60">
        <div className="flex flex-col">
          {product.originalPrice && (
            <span className="text-[11px] text-[#C4B59D] line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
          <span className="font-bebas text-xl sm:text-2xl text-[#FF6A00] tracking-wide leading-none">
            {formatCurrency(product.price)}
          </span>
        </div>

        <button
          disabled={!product.isAvailable}
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#FF6A00] text-white hover:bg-[#E55F00] transition-transform active:scale-95 disabled:bg-[#2A2A2A] disabled:text-neutral-500 shadow-glow"
          aria-label={`Adicionar ${product.name}`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
