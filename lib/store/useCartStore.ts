import { create } from "zustand";
import { CartItem, Product, SelectedCustomization } from "@/types/store";
import { defaultStoreConfig } from "@/lib/config/store.config";

interface CustomerAddress {
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  referencePoint?: string;
}

interface CartStore {
  items: CartItem[];
  deliveryType: "delivery" | "pickup";
  customerName: string;
  customerPhone: string;
  address: CustomerAddress;
  paymentMethod: string;
  changeFor: string;
  orderNotes: string;
  isCartOpen: boolean;
  selectedProductForModal: Product | null;

  // Actions
  addItem: (product: Product, quantity: number, customizations: SelectedCustomization[], specialInstructions?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  setDeliveryType: (type: "delivery" | "pickup") => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setAddress: (address: Partial<CustomerAddress>) => void;
  setPaymentMethod: (method: string) => void;
  setChangeFor: (val: string) => void;
  setOrderNotes: (notes: string) => void;
  setIsCartOpen: (open: boolean) => void;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;

  // Computed helpers
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemsCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  deliveryType: "delivery",
  customerName: "",
  customerPhone: "",
  address: {
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
    referencePoint: "",
  },
  paymentMethod: "pix",
  changeFor: "",
  orderNotes: "",
  isCartOpen: false,
  selectedProductForModal: null,

  addItem: (product, quantity, customizations, specialInstructions) => {
    // Calculate customization price
    const extrasTotal = customizations.reduce((acc, group) => {
      return (
        acc +
        group.items.reduce((itemAcc, item) => itemAcc + item.price * (item.quantity || 1), 0)
      );
    }, 0);

    const unitPrice = product.price + extrasTotal;
    const totalPrice = unitPrice * quantity;

    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      product,
      quantity,
      selectedCustomizations: customizations,
      specialInstructions,
      unitPrice,
      totalPrice,
    };

    set((state) => ({
      items: [...state.items, newItem],
      selectedProductForModal: null,
      isCartOpen: true,
    }));
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId, delta) => {
    set((state) => {
      const updated = state.items
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      return { items: updated };
    });
  },

  clearCart: () => {
    set({
      items: [],
      orderNotes: "",
      changeFor: "",
    });
  },

  setDeliveryType: (deliveryType) => set({ deliveryType }),
  setCustomerName: (customerName) => set({ customerName }),
  setCustomerPhone: (customerPhone) => set({ customerPhone }),
  setAddress: (newAddr) =>
    set((state) => ({ address: { ...state.address, ...newAddr } })),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setChangeFor: (changeFor) => set({ changeFor }),
  setOrderNotes: (orderNotes) => set({ orderNotes }),
  setIsCartOpen: (isCartOpen) => set({ isCartOpen }),
  openProductModal: (selectedProductForModal) => set({ selectedProductForModal }),
  closeProductModal: () => set({ selectedProductForModal: null }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
  },

  getDeliveryFee: () => {
    const { deliveryType } = get();
    if (deliveryType === "pickup") return 0;
    const subtotal = get().getSubtotal();
    const { fee, freeDeliveryAbove } = defaultStoreConfig.delivery;
    if (freeDeliveryAbove && subtotal >= freeDeliveryAbove) {
      return 0;
    }
    return fee;
  },

  getTotal: () => {
    return get().getSubtotal() + get().getDeliveryFee();
  },

  getItemsCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
