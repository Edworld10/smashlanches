"use client";

import React, { useState, useMemo } from "react";
import { Category, Product } from "@/types/store";
import { Navbar } from "@/components/layout/Navbar";
import { Banner } from "@/components/layout/Banner";
import { CategoryTabs } from "@/components/store/CategoryTabs";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductModal } from "@/components/store/ProductModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartStore } from "@/lib/store/useCartStore";
import { ShoppingBag, ArrowRight, Flame } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StoreViewProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

export function StoreView({ initialCategories, initialProducts }: StoreViewProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    selectedProductForModal,
    openProductModal,
    closeProductModal,
    getItemsCount,
    getTotal,
    setIsCartOpen,
  } = useCartStore();

  const itemsCount = getItemsCount();
  const total = getTotal();

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesCategory =
        selectedCategoryId === "all" || product.categoryId === selectedCategoryId;
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.ingredients?.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [initialProducts, selectedCategoryId, searchQuery]);

  return (
    <div className="min-h-screen bg-[#080808] text-[#F3E3C7] pb-24 relative overflow-x-hidden">
      {/* Video-Style Cinematic Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-video-bg opacity-25 filter brightness-[0.65] contrast-[1.2]"
          style={{ backgroundImage: `url('/images/bg-video-grill.jpg')` }}
        />
        {/* Gradient Scrims & Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/90 via-[#080808]/85 to-[#080808]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#080808_85%)]" />

        {/* Ambient Video Embers */}
        <div className="ember-particle w-1.5 h-1.5 left-[10%] bottom-0 [animation-duration:14s] [animation-delay:0s]" />
        <div className="ember-particle w-1 h-1 left-[30%] bottom-0 [animation-duration:10s] [animation-delay:3s]" />
        <div className="ember-particle w-2 h-2 left-[52%] bottom-0 [animation-duration:15s] [animation-delay:1s]" />
        <div className="ember-particle w-1 h-1 left-[75%] bottom-0 [animation-duration:12s] [animation-delay:4s]" />
        <div className="ember-particle w-1.5 h-1.5 left-[90%] bottom-0 [animation-duration:13s] [animation-delay:2s]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Banner />

        <CategoryTabs
          categories={initialCategories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="container mx-auto max-w-5xl px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Flame className="h-12 w-12 text-[#FF6A00]/40 mb-3" />
            <h3 className="font-bebas text-2xl text-white">Nenhum item encontrado</h3>
            <p className="text-xs text-[#C4B59D] mt-1">
              Tente buscar por outro termo ou escolha outra categoria acima.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {selectedCategoryId === "all" && searchQuery === "" ? (
              // Grouped by Category
              initialCategories.map((category) => {
                const categoryProducts = initialProducts.filter(
                  (p) => p.categoryId === category.id
                );
                if (categoryProducts.length === 0) return null;

                return (
                  <section key={category.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide">
                        {category.name}
                      </h2>
                      <div className="h-px flex-1 bg-[#2A2A2A]" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelect={openProductModal}
                        />
                      ))}
                    </div>
                  </section>
                );
              })
            ) : (
              // Direct Grid for filtered/searched
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={openProductModal}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      </div>

      {/* Floating Mobile Sticky Cart CTA when items > 0 */}
      {itemsCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#FF6A00] to-[#E6391F] px-5 py-3.5 text-white shadow-2xl shadow-orange-500/30 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/30 font-bebas text-sm">
                {itemsCount}
              </div>
              <div className="text-left">
                <p className="font-bebas text-sm tracking-wide leading-none">Ver Carrinho</p>
                <p className="text-[11px] font-bold text-white/90">{formatCurrency(total)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 font-bold text-xs">
              <span>Finalizar</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      )}

      {/* Product Customization Modal */}
      <ProductModal
        product={selectedProductForModal}
        onClose={closeProductModal}
      />

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
