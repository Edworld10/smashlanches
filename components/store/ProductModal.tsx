"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Minus, Check, Flame, Clock } from "lucide-react";
import { Product, SelectedCustomization } from "@/types/store";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState<Record<string, { id: string; name: string; price: number }>>({});
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<Record<string, { id: string; name: string; price: number }[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Initialize defaults whenever product changes
  useEffect(() => {
    if (!product) return;
    setQuantity(1);
    setSpecialInstructions("");

    const initialRadios: Record<string, { id: string; name: string; price: number }> = {};
    const initialCheckboxes: Record<string, { id: string; name: string; price: number }[]> = {};

    product.customizations?.forEach((group) => {
      if (group.type === "radio") {
        const defaultItem = group.items.find((i) => i.isDefault) || group.items[0];
        if (defaultItem) {
          initialRadios[group.id] = { id: defaultItem.id, name: defaultItem.name, price: defaultItem.price };
        }
      } else {
        initialCheckboxes[group.id] = [];
      }
    });

    setSelectedRadio(initialRadios);
    setSelectedCheckboxes(initialCheckboxes);
  }, [product]);

  if (!product) return null;

  // Calculate extras total
  const radioTotal = Object.values(selectedRadio).reduce((acc, curr) => acc + (curr?.price || 0), 0);
  const checkTotal = Object.values(selectedCheckboxes).reduce(
    (acc, items) => acc + items.reduce((sub, item) => sub + item.price, 0),
    0
  );
  const unitPrice = product.price + radioTotal + checkTotal;
  const totalPrice = unitPrice * quantity;

  const handleCheckboxToggle = (groupId: string, item: { id: string; name: string; price: number }) => {
    setSelectedCheckboxes((prev) => {
      const currentList = prev[groupId] || [];
      const exists = currentList.some((i) => i.id === item.id);
      if (exists) {
        return {
          ...prev,
          [groupId]: currentList.filter((i) => i.id !== item.id),
        };
      } else {
        return {
          ...prev,
          [groupId]: [...currentList, item],
        };
      }
    });
  };

  const handleAddToCart = () => {
    const customizations: SelectedCustomization[] = [];

    // Add radio selections
    product.customizations?.forEach((group) => {
      if (group.type === "radio" && selectedRadio[group.id]) {
        customizations.push({
          groupId: group.id,
          groupName: group.name,
          items: [selectedRadio[group.id]],
        });
      } else if (selectedCheckboxes[group.id]?.length > 0) {
        customizations.push({
          groupId: group.id,
          groupName: group.name,
          items: selectedCheckboxes[group.id],
        });
      }
    });

    addItem(product, quantity, customizations, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#161616] text-[#F3E3C7] shadow-2xl">
        {/* Header with image */}
        <div
          className={`relative w-full overflow-hidden border-b border-[#2A2A2A] ${
            product.categoryId === "bebidas"
              ? "h-64 sm:h-72 bg-[radial-gradient(ellipse_at_center,_#2a2a2a_0%,_#121212_70%,_#070707_100%)] flex items-center justify-center p-4"
              : "aspect-[16/10] sm:aspect-video bg-[#0A0A0A] flex items-center justify-center overflow-hidden"
          }`}
        >
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/assets/aistudio/smashes_logo_a4050271.webp";
            }}
            className={`h-full w-full ${
              product.categoryId === "bebidas"
                ? "object-contain max-h-[240px] sm:max-h-[270px] drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)]"
                : "object-cover object-center"
            }`}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur hover:bg-black transition-colors z-20"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>

          {product.badge && (
            <div className="absolute bottom-3 left-3 rounded-lg bg-[#FF6A00] px-2.5 py-1 text-xs font-bold text-black uppercase tracking-wider font-bebas z-10 shadow-lg">
              {product.badge}
            </div>
          )}
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide">
                {product.name}
              </h2>
              <span className="font-bebas text-2xl text-[#FF6A00]">
                {formatCurrency(product.price)}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#C4B59D] leading-relaxed">
              {product.description}
            </p>

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-[#222222] px-2 py-0.5 text-[11px] text-[#C4B59D] border border-[#2A2A2A]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Customization Groups */}
          {product.customizations && product.customizations.length > 0 && (
            <div className="space-y-5">
              {product.customizations.map((group) => (
                <div key={group.id} className="space-y-2.5 rounded-xl border border-[#2A2A2A] bg-[#1C1C1C] p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bebas text-lg text-white tracking-wide">
                        {group.name}
                      </h4>
                      {group.required && (
                        <span className="text-[10px] uppercase font-bold text-[#FF6A00]">
                          Obrigatório • Escolha 1 opção
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    {group.type === "radio" &&
                      group.items.map((item) => {
                        const isChecked = selectedRadio[group.id]?.id === item.id;
                        return (
                          <label
                            key={item.id}
                            className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors cursor-pointer ${
                              isChecked
                                ? "border-[#FF6A00] bg-[#FF6A00]/10 text-white"
                                : "border-[#2A2A2A] bg-[#161616] text-[#C4B59D] hover:border-[#333]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={group.id}
                                checked={isChecked}
                                onChange={() =>
                                  setSelectedRadio((prev) => ({
                                    ...prev,
                                    [group.id]: { id: item.id, name: item.name, price: item.price },
                                  }))
                                }
                                className="accent-[#FF6A00]"
                              />
                              <span className="text-xs sm:text-sm font-medium">{item.name}</span>
                            </div>
                            {item.price > 0 && (
                              <span className="text-xs font-bold text-[#FF6A00]">
                                +{formatCurrency(item.price)}
                              </span>
                            )}
                          </label>
                        );
                      })}

                    {group.type === "checkbox" &&
                      group.items.map((item) => {
                        const isChecked = selectedCheckboxes[group.id]?.some((i) => i.id === item.id);
                        return (
                          <label
                            key={item.id}
                            className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors cursor-pointer ${
                              isChecked
                                ? "border-[#FF6A00] bg-[#FF6A00]/10 text-white"
                                : "border-[#2A2A2A] bg-[#161616] text-[#C4B59D] hover:border-[#333]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheckboxToggle(group.id, item)}
                                className="rounded accent-[#FF6A00]"
                              />
                              <span className="text-xs sm:text-sm font-medium">{item.name}</span>
                            </div>
                            {item.price > 0 && (
                              <span className="text-xs font-bold text-[#FF6A00]">
                                +{formatCurrency(item.price)}
                              </span>
                            )}
                          </label>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Observations */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#C4B59D]">
              Alguma observação especial?
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ex: sem cebola, maionese à parte, cortar ao meio..."
              rows={2}
              className="w-full rounded-xl border border-[#2A2A2A] bg-[#1C1C1C] p-3 text-xs sm:text-sm text-[#F3E3C7] placeholder-[#C4B59D]/50 focus:border-[#FF6A00] focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Footer / Quantity & Submit */}
        <div className="flex items-center justify-between gap-4 border-t border-[#2A2A2A] bg-[#141414] p-4">
          <div className="flex items-center rounded-xl border border-[#2A2A2A] bg-[#1C1C1C]">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-11 w-11 items-center justify-center text-[#C4B59D] hover:text-white disabled:opacity-30 transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-bebas text-lg text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-11 w-11 items-center justify-center text-[#C4B59D] hover:text-white transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={handleAddToCart}
            className="flex-1 h-11 bg-[#FF6A00] hover:bg-[#E55F00] text-white font-bold"
          >
            <span>Adicionar • {formatCurrency(totalPrice)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
