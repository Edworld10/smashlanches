import demoData from "@/data/cardapio-demo.json";
import { Category, Product, Order } from "@/types/store";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

// In-memory runtime cache for fallback mode (White Label demo)
let categoriesCache: Category[] = [...(demoData.categories as Category[])];
let productsCache: Product[] = [...(demoData.products as Product[])];
let ordersCache: Order[] = [
  {
    id: "ord-1001",
    code: "#1001",
    customerName: "Rodrigo Almeida",
    customerPhone: "(11) 98765-4321",
    deliveryType: "delivery",
    address: {
      street: "Rua Ettore Vilardi",
      number: "180",
      neighborhood: "Vila Amélia",
      complement: "Casa 2",
      city: "Poá",
    },
    paymentMethod: "PIX",
    items: [
      {
        id: "item-1",
        product: demoData.products[4] as Product, // Legend Double Cheddar
        quantity: 2,
        selectedCustomizations: [
          {
            groupId: "ponto-carne",
            groupName: "Ponto da Carne",
            items: [{ id: "ao-ponto", name: "Ao Ponto (Rosado e Suculento)", price: 0 }],
          },
          {
            groupId: "adicionais",
            groupName: "Turbine seu Double Cheddar",
            items: [{ id: "extra-bacon", name: "Tiras de Bacon Crocantes", price: 5.00 }],
          },
        ],
        unitPrice: 30.90,
        totalPrice: 61.80,
      },
      {
        id: "item-2",
        product: demoData.products[10] as Product, // Fritas Cheddar e Bacon
        quantity: 1,
        selectedCustomizations: [],
        unitPrice: 21.90,
        totalPrice: 21.90,
      },
    ],
    subtotal: 83.70,
    deliveryFee: 0,
    total: 83.70,
    status: "preparing",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "ord-1002",
    code: "#1002",
    customerName: "Juliana Santos",
    customerPhone: "(11) 97654-3210",
    deliveryType: "pickup",
    paymentMethod: "Cartão de Crédito",
    items: [
      {
        id: "item-3",
        product: demoData.products[2] as Product, // Legend Onion
        quantity: 1,
        selectedCustomizations: [
          {
            groupId: "ponto-carne",
            groupName: "Ponto da Carne",
            items: [{ id: "ao-ponto", name: "Ao Ponto (Rosado e Suculento)", price: 0 }],
          },
        ],
        unitPrice: 17.90,
        totalPrice: 17.90,
      },
      {
        id: "item-4",
        product: demoData.products[13] as Product, // Refri 350ml
        quantity: 1,
        selectedCustomizations: [
          {
            groupId: "sabor-lata",
            groupName: "Escolha o Refrigerante Lata",
            items: [{ id: "coca-zero", name: "Coca-Cola Zero 350ml", price: 0 }],
          },
        ],
        unitPrice: 6.00,
        totalPrice: 6.00,
      },
    ],
    subtotal: 23.90,
    deliveryFee: 0,
    total: 23.90,
    status: "delivering",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
];

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          icon: item.icon,
          sortOrder: item.sort_order ?? item.sortOrder ?? 0,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to demo data", e);
    }
  }
  return categoriesCache;
}

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          categoryId: item.category_id,
          image: item.image,
          badge: item.badge,
          isAvailable: item.is_available ?? true,
          isFeatured: item.is_featured ?? false,
          preparationTime: item.preparation_time,
          ingredients: item.ingredients,
          customizations: item.customizations,
        }));
      }
    } catch (e) {
      console.warn("Supabase products fetch failed, falling back to demo data", e);
    }
  }
  return productsCache;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function toggleProductAvailability(id: string, isAvailable: boolean): Promise<boolean> {
  productsCache = productsCache.map((p) =>
    p.id === id ? { ...p, isAvailable } : p
  );
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("products")
        .update({ is_available: isAvailable })
        .eq("id", id);
    } catch (e) {
      console.warn("Supabase update error", e);
    }
  }
  return true;
}

export async function updateProductPrice(id: string, newPrice: number): Promise<boolean> {
  productsCache = productsCache.map((p) =>
    p.id === id ? { ...p, price: newPrice } : p
  );
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("products")
        .update({ price: newPrice })
        .eq("id", id);
    } catch (e) {
      console.warn("Supabase price update error", e);
    }
  }
  return true;
}

export async function getOrders(): Promise<Order[]> {
  return ordersCache;
}

export async function addOrder(order: Omit<Order, "id" | "code" | "createdAt" | "status">): Promise<Order> {
  const newOrder: Order = {
    ...order,
    id: `ord-${Date.now()}`,
    code: `#${Math.floor(1000 + Math.random() * 9000)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  ordersCache = [newOrder, ...ordersCache];
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<boolean> {
  ordersCache = ordersCache.map((o) =>
    o.id === orderId ? { ...o, status } : o
  );
  return true;
}
