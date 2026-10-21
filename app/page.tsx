import React from "react";
import { getCategories, getProducts } from "@/lib/data/cardapio";
import { StoreView } from "@/components/store/StoreView";

// Keep dynamic for real-time order/catalog changes
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return <StoreView initialCategories={categories} initialProducts={products} />;
}
