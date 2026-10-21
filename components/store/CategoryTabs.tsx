"use client";

import React from "react";
import { Category } from "@/types/store";
import { Flame, Beef, UtensilsCrossed, Salad, CupSoda, IceCream, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="h-4 w-4" />,
  Beef: <Beef className="h-4 w-4" />,
  UtensilsCrossed: <UtensilsCrossed className="h-4 w-4" />,
  Salad: <Salad className="h-4 w-4" />,
  CupSoda: <CupSoda className="h-4 w-4" />,
  IceCream: <IceCream className="h-4 w-4" />,
};

export function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-16 z-30 bg-[#080808]/95 backdrop-blur border-b border-[#2A2A2A] py-3">
      <div className="container mx-auto max-w-5xl px-4 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4B59D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por hambúrguer, ingrediente, combo ou bebida..."
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#161616] pl-10 pr-4 py-2 text-sm text-[#F3E3C7] placeholder-[#C4B59D]/60 focus:border-[#FF6A00] focus:outline-none focus:ring-1 focus:ring-[#FF6A00]"
          />
        </div>

        {/* Horizontal Category Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          <button
            onClick={() => onSelectCategory("all")}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all",
              selectedCategoryId === "all"
                ? "bg-[#FF6A00] text-black shadow-glow"
                : "bg-[#1C1C1C] text-[#C4B59D] hover:bg-[#262626] hover:text-[#F3E3C7] border border-[#2A2A2A]"
            )}
          >
            <span>Todos</span>
          </button>

          {categories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            const icon = category.icon ? iconMap[category.icon] || <Flame className="h-4 w-4" /> : null;

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                  isSelected
                    ? "bg-[#FF6A00] text-black shadow-glow"
                    : "bg-[#1C1C1C] text-[#C4B59D] hover:bg-[#262626] hover:text-[#F3E3C7] border border-[#2A2A2A]"
                )}
              >
                {icon}
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
