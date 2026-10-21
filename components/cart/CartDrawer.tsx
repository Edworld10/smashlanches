"use client";

import React, { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Bike,
  Store,
  CreditCard,
  Banknote,
  QrCode,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { defaultStoreConfig } from "@/lib/config/store.config";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { openWhatsAppCheckout } from "@/lib/whatsapp";
import { addOrder } from "@/lib/data/cardapio";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    deliveryType,
    setDeliveryType,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    address,
    setAddress,
    paymentMethod,
    setPaymentMethod,
    changeFor,
    setChangeFor,
    orderNotes,
    setOrderNotes,
    getSubtotal,
    getDeliveryFee,
    getTotal,
  } = useCartStore();

  const [step, setStep] = useState<"items" | "checkout">("items");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderCode, setCompletedOrderCode] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setStep("checkout");
  };

  const handleFinalizeWhatsApp = async () => {
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Por favor, informe seu nome.");
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setErrorMsg("Por favor, informe seu telefone/WhatsApp.");
      return;
    }

    if (deliveryType === "delivery") {
      if (!address.street.trim() || !address.number.trim() || !address.neighborhood.trim()) {
        setErrorMsg("Por favor, preencha rua, número e bairro para a entrega.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderCode = `#${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Save order in data layer
      await addOrder({
        customerName,
        customerPhone,
        deliveryType,
        address: deliveryType === "delivery" ? {
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          complement: address.complement,
          referencePoint: address.referencePoint,
          city: defaultStoreConfig.address.city,
        } : undefined,
        paymentMethod,
        changeFor: changeFor ? Number(changeFor) : undefined,
        items,
        subtotal,
        deliveryFee,
        total,
        specialInstructions: orderNotes,
      });

      // Send to WhatsApp
      openWhatsAppCheckout({
        orderCode,
        customerName,
        customerPhone,
        deliveryType,
        address: deliveryType === "delivery" ? address : undefined,
        items,
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        changeFor,
        orderNotes,
      });

      setCompletedOrderCode(orderCode);
      clearCart();
    } catch (err) {
      console.error(err);
      setErrorMsg("Ocorreu um erro ao processar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setStep("items");
    setCompletedOrderCode(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-md flex-col bg-[#141414] text-[#F3E3C7] shadow-2xl border-l border-[#2A2A2A]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2A] p-4 bg-[#181818]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#FF6A00]" />
            <h2 className="font-bebas text-xl text-white tracking-wide">
              {completedOrderCode
                ? "Pedido Enviado!"
                : step === "items"
                ? "Seu Carrinho"
                : "Dados & Entrega"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#C4B59D] hover:bg-[#262626] hover:text-white transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {completedOrderCode ? (
            /* Success screen */
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="font-bebas text-3xl text-white">Pedido Realizado com Sucesso!</h3>
              <p className="text-xs text-[#C4B59D] max-w-xs">
                Seu pedido foi registrado no sistema e a janela do WhatsApp foi aberta para você enviar a mensagem diretamente para nossa equipe.
              </p>
              <div className="rounded-xl border border-[#2A2A2A] bg-[#1C1C1C] p-3 text-sm font-mono text-[#FF6A00]">
                Código do Pedido: {completedOrderCode}
              </div>
              <Button onClick={handleClose} className="mt-4">
                Fazer Novo Pedido
              </Button>
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1C1C1C] border border-[#2A2A2A] text-[#C4B59D]">
                <ShoppingBag className="h-10 w-10 stroke-1" />
              </div>
              <div>
                <h3 className="font-bebas text-2xl text-white">Carrinho Vazio</h3>
                <p className="text-xs text-[#C4B59D] mt-1 max-w-[220px]">
                  Adicione nossos smash burgers e porções irresistíveis para continuar.
                </p>
              </div>
              <Button onClick={() => setIsCartOpen(false)} variant="outline">
                Explorar Cardápio
              </Button>
            </div>
          ) : step === "items" ? (
            /* STEP 1: Items List */
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-3 transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={`h-16 w-16 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] shrink-0 ${
                      item.product.categoryId === "bebidas" ? "object-contain p-1" : "object-cover"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bebas text-base text-white tracking-wide truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#C4B59D] hover:text-[#E6391F] transition-colors p-1"
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Customizations display */}
                    {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                      <div className="my-1 space-y-0.5">
                        {item.selectedCustomizations.map((group, idx) => (
                          <div key={idx} className="text-[11px] text-[#C4B59D]">
                            <span className="font-medium text-white/80">{group.groupName}: </span>
                            {group.items.map((i) => i.name).join(", ")}
                          </div>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[10px] text-amber-300 italic">
                        Obs: {item.specialInstructions}
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bebas text-base text-[#FF6A00]">
                        {formatCurrency(item.totalPrice)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-lg border border-[#2A2A2A] bg-[#141414]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex h-7 w-7 items-center justify-center text-[#C4B59D] hover:text-white"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex h-7 w-7 items-center justify-center text-[#C4B59D] hover:text-white"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* STEP 2: Checkout details */
            <div className="space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Delivery or Pickup Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#C4B59D]">
                  Como deseja receber?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("delivery")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                      deliveryType === "delivery"
                        ? "border-[#FF6A00] bg-[#FF6A00]/15 text-[#FF6A00]"
                        : "border-[#2A2A2A] bg-[#1A1A1A] text-[#C4B59D] hover:border-[#333]"
                    }`}
                  >
                    <Bike className="h-4 w-4" />
                    <span>Entrega Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType("pickup")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                      deliveryType === "pickup"
                        ? "border-[#FF6A00] bg-[#FF6A00]/15 text-[#FF6A00]"
                        : "border-[#2A2A2A] bg-[#1A1A1A] text-[#C4B59D] hover:border-[#333]"
                    }`}
                  >
                    <Store className="h-4 w-4" />
                    <span>Retirar no Balcão</span>
                  </button>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="space-y-3 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-3.5">
                <h4 className="font-bebas text-base text-white tracking-wide">
                  Seus Dados
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-[#C4B59D] block mb-1">Seu Nome *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: João da Silva"
                      className="w-full rounded-lg border border-[#2A2A2A] bg-[#141414] px-3 py-2 text-xs text-[#F3E3C7] focus:border-[#FF6A00] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#C4B59D] block mb-1">Telefone / WhatsApp *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(51) 99999-9999"
                      className="w-full rounded-lg border border-[#2A2A2A] bg-[#141414] px-3 py-2 text-xs text-[#F3E3C7] focus:border-[#FF6A00] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address fields */}
              {deliveryType === "delivery" && (
                <div className="space-y-3 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-3.5">
                  <h4 className="font-bebas text-base text-white tracking-wide">
                    Endereço de Entrega
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[11px] text-[#C4B59D] block mb-1">Rua / Avenida *</label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => setAddress({ street: e.target.value })}
                        placeholder="Rua..."
                        className="w-full rounded-lg border border-[#2A2A2A] bg-[#141414] px-3 py-2 text-xs text-[#F3E3C7] focus:border-[#FF6A00] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#C4B59D] block mb-1">Número *</label>
                      <input
                        type="text"
                        value={address.number}
                        onChange={(e) => setAddress({ number: e.target.value })}
                        placeholder="123"
                        className="w-full rounded-lg border border-[#2A2A2A] bg-[#141414] px-3 py-2 text-xs text-[#F3E3C7] focus:border-[#FF6A00] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#C4B59D] block mb-1">Bairro *</label>
                      <input
                        type="text"
                        value={address.neighborhood}
                        onChange={(e) => setAddress({ neighborhood: e.target.value })}
                        placeholder="Bairro"
                        className="w-full rounded-lg border border-[#2A2A2A] bg-[#141414] px-3 py-2 text-xs text-[#F3E3C7] focus:border-[#FF6A00] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#C4B59D] block mb-1">Complemento</label>
                      <input
                        type="text"
                        value={address.complement || ""}
                        onChange={(e) => setAddress({ complement: e.target.value })}
                        placeholder="Apto 101, Bloco B"
                        className="w-full rounded-lg border border-[#2A2A2A] bg-[#141414] px-3 py-2 text-xs text-[#F3E3C7] focus:border-[#FF6A00] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#C4B59D] block mb-1">Ponto de Referência</label>
                    <input
                      type="text"
                      value={address.referencePoint || ""}
                      onChange={(e) => setAddress({ referencePoint: e.target.value })}
                      placeholder="Ex: Próximo à farmácia"
                      className="w-full rounded-lg border border-[#2A2A2A] bg-[#141414] px-3 py-2 text-xs text-[#F3E3C7] focus:border-[#FF6A00] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div className="space-y-2 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-3.5">
                <h4 className="font-bebas text-base text-white tracking-wide">
                  Forma de Pagamento
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "pix", name: "PIX", icon: <QrCode className="h-4 w-4" /> },
                    { id: "credit", name: "Crédito", icon: <CreditCard className="h-4 w-4" /> },
                    { id: "debit", name: "Débito", icon: <CreditCard className="h-4 w-4" /> },
                    { id: "cash", name: "Dinheiro", icon: <Banknote className="h-4 w-4" /> },
                  ].map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? "border-[#FF6A00] bg-[#FF6A00]/15 text-white"
                            : "border-[#2A2A2A] bg-[#141414] text-[#C4B59D] hover:border-[#333]"
                        }`}
                      >
                        <span className={isSelected ? "text-[#FF6A00]" : "text-[#C4B59D]"}>
                          {method.icon}
                        </span>
                        <span>{method.name}</span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === "cash" && (
                  <div className="pt-2">
                    <label className="text-[11px] text-[#C4B59D] block mb-1">Precisa de troco para quanto?</label>
                    <input
                      type="number"
                      value={changeFor}
                      onChange={(e) => setChangeFor(e.target.value)}
                      placeholder="Ex: 100"
                      className="w-full rounded-lg border border-[#2A2A2A] bg-[#141414] px-3 py-2 text-xs text-[#F3E3C7] focus:border-[#FF6A00] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label className="text-[11px] text-[#C4B59D] block mb-1">Observações do Pedido (Opcional)</label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ex: Tocar o interfone, embalar separado..."
                  rows={2}
                  className="w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-2.5 text-xs text-[#F3E3C7] focus:border-[#FF6A00] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && !completedOrderCode && (
          <div className="border-t border-[#2A2A2A] bg-[#181818] p-4 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#C4B59D]">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {deliveryType === "delivery" && (
                <div className="flex justify-between text-[#C4B59D]">
                  <span>Taxa de Entrega</span>
                  <span>{deliveryFee === 0 ? "GRÁTIS" : formatCurrency(deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bebas text-xl text-white pt-1 border-t border-[#2A2A2A]">
                <span>Total</span>
                <span className="text-[#FF6A00]">{formatCurrency(total)}</span>
              </div>
            </div>

            {step === "items" ? (
              <Button
                onClick={handleProceedToCheckout}
                className="w-full h-12 bg-[#FF6A00] hover:bg-[#E55F00] text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <span>Continuar para Entrega</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep("items")}
                  className="h-12 px-4"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleFinalizeWhatsApp}
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Enviar pelo WhatsApp</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
