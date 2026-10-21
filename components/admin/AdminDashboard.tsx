"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  ArrowLeft,
  DollarSign,
  PackageCheck,
  TrendingUp,
  Clock,
  Eye,
  EyeOff,
  CheckCircle,
  Truck,
  ChefHat,
  XCircle,
  Settings,
  SlidersHorizontal,
  Save,
  Check
} from "lucide-react";
import { Category, Product, Order } from "@/types/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { defaultStoreConfig } from "@/lib/config/store.config";
import { toggleProductAvailability, updateProductPrice, updateOrderStatus } from "@/lib/data/cardapio";

interface AdminDashboardProps {
  initialProducts: Product[];
  initialOrders: Order[];
  initialCategories: Category[];
}

export function AdminDashboard({
  initialProducts,
  initialOrders,
  initialCategories,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "catalog" | "settings">("orders");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // White label settings form
  const [storeName, setStoreName] = useState(defaultStoreConfig.name);
  const [storeWhatsapp, setStoreWhatsapp] = useState(defaultStoreConfig.whatsapp);
  const [deliveryFee, setDeliveryFee] = useState(defaultStoreConfig.delivery.fee.toString());
  const [freeDeliveryAbove, setFreeDeliveryAbove] = useState(
    (defaultStoreConfig.delivery.freeDeliveryAbove || 90).toString()
  );

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.status !== "cancelled" ? sum + o.total : sum), 0);
  const totalOrdersCount = orders.length;
  const averageTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const activeProductsCount = products.filter((p) => p.isAvailable).length;

  const handleToggleProduct = async (product: Product) => {
    const newStatus = !product.isAvailable;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isAvailable: newStatus } : p))
    );
    await toggleProductAvailability(product.id, newStatus);
  };

  const handleSavePrice = async (productId: string) => {
    const parsed = parseFloat(tempPrice.replace(",", "."));
    if (!isNaN(parsed) && parsed > 0) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, price: parsed } : p))
      );
      await updateProductPrice(productId, parsed);
    }
    setEditingPriceId(null);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    await updateOrderStatus(orderId, status);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    defaultStoreConfig.name = storeName;
    defaultStoreConfig.whatsapp = storeWhatsapp;
    defaultStoreConfig.delivery.fee = parseFloat(deliveryFee) || 0;
    defaultStoreConfig.delivery.freeDeliveryAbove = parseFloat(freeDeliveryAbove) || 0;
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F3E3C7]">
      {/* Top Header */}
      <header className="border-b border-[#2A2A2A] bg-[#141414] px-4 py-3 sticky top-0 z-30">
        <div className="container mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1C1C1C] text-[#C4B59D] hover:text-white border border-[#2A2A2A] transition-colors"
              title="Voltar ao Cardápio"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-[#FF7A00]" />
                <h1 className="font-bebas text-xl text-white tracking-wide">
                  Painel de Controle Smash Legend
                </h1>
              </div>
              <p className="text-[10px] text-[#C4B59D] -mt-0.5">
                Gestão de Pedidos, Cardápio & Configurações White Label
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg bg-[#FF6A00] text-black px-3 py-1.5 text-xs font-bold hover:bg-[#E55F00] transition-colors shadow-glow"
          >
            Ver Cardápio Ao Vivo
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#161616] p-4">
            <div className="flex items-center justify-between text-[#C4B59D] mb-1">
              <span className="text-xs uppercase font-bold tracking-wider">Faturamento</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="font-bebas text-2xl text-white">{formatCurrency(totalRevenue)}</p>
            <p className="text-[10px] text-[#C4B59D]">Soma dos pedidos ativos</p>
          </div>

          <div className="rounded-2xl border border-[#2A2A2A] bg-[#161616] p-4">
            <div className="flex items-center justify-between text-[#C4B59D] mb-1">
              <span className="text-xs uppercase font-bold tracking-wider">Pedidos</span>
              <PackageCheck className="h-4 w-4 text-[#FF6A00]" />
            </div>
            <p className="font-bebas text-2xl text-white">{totalOrdersCount}</p>
            <p className="text-[10px] text-[#C4B59D]">Total de registros</p>
          </div>

          <div className="rounded-2xl border border-[#2A2A2A] bg-[#161616] p-4">
            <div className="flex items-center justify-between text-[#C4B59D] mb-1">
              <span className="text-xs uppercase font-bold tracking-wider">Ticket Médio</span>
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </div>
            <p className="font-bebas text-2xl text-white">{formatCurrency(averageTicket)}</p>
            <p className="text-[10px] text-[#C4B59D]">Média por pedido</p>
          </div>

          <div className="rounded-2xl border border-[#2A2A2A] bg-[#161616] p-4">
            <div className="flex items-center justify-between text-[#C4B59D] mb-1">
              <span className="text-xs uppercase font-bold tracking-wider">Produtos Ativos</span>
              <ChefHat className="h-4 w-4 text-orange-400" />
            </div>
            <p className="font-bebas text-2xl text-white">
              {activeProductsCount} / {products.length}
            </p>
            <p className="text-[10px] text-[#C4B59D]">No cardápio online</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-2">
          {[
            { id: "orders", label: `Pedidos em Aberto (${orders.length})` },
            { id: "catalog", label: `Estoque & Cardápio (${products.length})` },
            { id: "settings", label: "Configuração White Label" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-[#FF6A00] text-black shadow-glow"
                  : "bg-[#1C1C1C] text-[#C4B59D] hover:bg-[#262626] hover:text-white border border-[#2A2A2A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#C4B59D] border border-[#2A2A2A] rounded-2xl bg-[#141414]">
                Nenhum pedido registrado até o momento.
              </div>
            ) : (
              orders.map((order) => {
                const statusColors = {
                  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
                  preparing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
                  delivering: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
                };

                const statusLabels = {
                  pending: "Pendente",
                  preparing: "Na Chapa / Preparando",
                  delivering: "Saiu para Entrega",
                  completed: "Entregue / Concluído",
                  cancelled: "Cancelado",
                };

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-[#2A2A2A] bg-[#161616] p-4 sm:p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2A2A] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bebas text-2xl text-[#FF6A00]">{order.code}</span>
                        <div>
                          <p className="font-bold text-sm text-white">{order.customerName}</p>
                          <p className="text-xs text-[#C4B59D]">{order.customerPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                            statusColors[order.status]
                          }`}
                        >
                          {statusLabels[order.status]}
                        </span>
                        <span className="font-bebas text-xl text-white">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Delivery & Items details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="text-[#C4B59D] font-bold uppercase tracking-wider text-[10px]">
                          Tipo de Atendimento:
                        </p>
                        <p className="text-white font-medium">
                          {order.deliveryType === "delivery" ? "🚀 Entrega Delivery" : "🛍️ Retirada no Balcão"}
                        </p>
                        {order.address && (
                          <p className="text-[#C4B59D]">
                            {order.address.street}, {order.address.number} - {order.address.neighborhood}
                            {order.address.complement && ` (${order.address.complement})`}
                          </p>
                        )}
                        <p className="text-[#C4B59D]">
                          Pagamento: <span className="text-white font-semibold">{order.paymentMethod}</span>
                          {order.changeFor && ` (Troco para ${formatCurrency(order.changeFor)})`}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[#C4B59D] font-bold uppercase tracking-wider text-[10px]">
                          Itens do Pedido:
                        </p>
                        <ul className="space-y-1">
                          {order.items.map((item, i) => (
                            <li key={i} className="text-[#F3E3C7]">
                              <span className="font-bold text-[#FF6A00]">{item.quantity}x</span>{" "}
                              {item.product.name}
                              {item.selectedCustomizations?.map((c) => (
                                <span key={c.groupId} className="text-[#C4B59D] text-[11px] block pl-4">
                                  - {c.groupName}: {c.items.map((x) => x.name).join(", ")}
                                </span>
                              ))}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Status action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2A2A2A]">
                      <span className="text-xs text-[#C4B59D] font-medium mr-2">Mudar Status:</span>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "preparing")}
                        className="rounded-lg border border-[#2A2A2A] bg-[#1C1C1C] px-2.5 py-1 text-xs text-[#F3E3C7] hover:border-[#FF6A00]"
                      >
                        Preparando
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "delivering")}
                        className="rounded-lg border border-[#2A2A2A] bg-[#1C1C1C] px-2.5 py-1 text-xs text-[#F3E3C7] hover:border-blue-500"
                      >
                        Em Rota
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                        className="rounded-lg border border-[#2A2A2A] bg-[#1C1C1C] px-2.5 py-1 text-xs text-emerald-400 hover:border-emerald-500"
                      >
                        Concluído
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                        className="rounded-lg border border-[#2A2A2A] bg-[#1C1C1C] px-2.5 py-1 text-xs text-red-400 hover:border-red-500"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Catalog & Stock Management */}
        {activeTab === "catalog" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#C4B59D]">
              <span>Controle rápido de disponibilidade e preços em tempo real</span>
            </div>

            <div className="divide-y divide-[#2A2A2A] rounded-2xl border border-[#2A2A2A] bg-[#161616] overflow-hidden">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-[#1C1C1C] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`h-12 w-12 rounded-lg bg-[#0E0E0E] border border-[#2A2A2A] shrink-0 ${
                        product.categoryId === "bebidas" ? "object-contain p-1" : "object-cover"
                      }`}
                    />
                    <div>
                      <h4 className="font-bebas text-lg text-white tracking-wide">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#C4B59D] line-clamp-1 max-w-sm">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Price edit */}
                    {editingPriceId === product.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(e.target.value)}
                          className="w-20 rounded-lg border border-[#FF6A00] bg-[#141414] px-2 py-1 text-xs text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePrice(product.id)}
                          className="rounded-lg bg-emerald-600 p-1.5 text-white"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingPriceId(product.id);
                          setTempPrice(product.price.toString());
                        }}
                        className="font-bebas text-lg text-[#FF6A00] hover:underline"
                        title="Clique para editar o preço"
                      >
                        {formatCurrency(product.price)}
                      </button>
                    )}

                    {/* Stock availability toggle */}
                    <button
                      onClick={() => handleToggleProduct(product)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
                        product.isAvailable
                          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                          : "bg-red-950/40 border-red-500/40 text-red-400"
                      }`}
                    >
                      {product.isAvailable ? (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          <span>Disponível</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Esgotado</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: White Label Settings */}
        {activeTab === "settings" && (
          <form
            onSubmit={handleSaveSettings}
            className="rounded-2xl border border-[#2A2A2A] bg-[#161616] p-5 sm:p-6 space-y-5"
          >
            <div>
              <h3 className="font-bebas text-2xl text-white">Configurações White Label</h3>
              <p className="text-xs text-[#C4B59D]">
                Altere os parâmetros da sua hamburgueria sem alterar o código-fonte.
              </p>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 p-3 text-xs text-emerald-400">
                <Check className="h-4 w-4" />
                <span>Configurações atualizadas com sucesso!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#C4B59D] block mb-1">
                  Nome do Estabelecimento
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full rounded-xl border border-[#2A2A2A] bg-[#1C1C1C] px-3.5 py-2.5 text-xs text-white focus:border-[#FF6A00] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#C4B59D] block mb-1">
                  WhatsApp para Pedidos (com DDI e DDD)
                </label>
                <input
                  type="text"
                  value={storeWhatsapp}
                  onChange={(e) => setStoreWhatsapp(e.target.value)}
                  className="w-full rounded-xl border border-[#2A2A2A] bg-[#1C1C1C] px-3.5 py-2.5 text-xs text-white focus:border-[#FF6A00] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#C4B59D] block mb-1">
                  Taxa de Entrega Padrão (R$)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full rounded-xl border border-[#2A2A2A] bg-[#1C1C1C] px-3.5 py-2.5 text-xs text-white focus:border-[#FF6A00] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#C4B59D] block mb-1">
                  Entrega Grátis Acima de (R$)
                </label>
                <input
                  type="number"
                  step="1"
                  value={freeDeliveryAbove}
                  onChange={(e) => setFreeDeliveryAbove(e.target.value)}
                  className="w-full rounded-xl border border-[#2A2A2A] bg-[#1C1C1C] px-3.5 py-2.5 text-xs text-white focus:border-[#FF6A00] focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>Salvar Alterações</span>
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
