import React from "react";
import { getProducts, getOrders, getCategories } from "@/lib/data/cardapio";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Painel Administrativo — Brasa Burgers",
  description: "Gerenciamento de pedidos, cardápio e configurações do delivery.",
};

export default async function AdminPage() {
  const [products, orders, categories] = await Promise.all([
    getProducts(),
    getOrders(),
    getCategories(),
  ]);

  return (
    <AdminDashboard
      initialProducts={products}
      initialOrders={orders}
      initialCategories={categories}
    />
  );
}
