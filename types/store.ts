export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  sortOrder: number;
}

export interface CustomizationItem {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface CustomizationGroup {
  id: string;
  name: string;
  description?: string;
  type: 'radio' | 'checkbox' | 'counter';
  min?: number;
  max?: number;
  required?: boolean;
  items: CustomizationItem[];
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  image: string;
  badge?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  preparationTime?: string;
  ingredients?: string[];
  customizations?: CustomizationGroup[];
}

export interface SelectedCustomization {
  groupId: string;
  groupName: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
  }[];
}

export interface CartItem {
  id: string; // unique cart item instance id
  product: Product;
  quantity: number;
  selectedCustomizations: SelectedCustomization[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface StoreHours {
  dayOfWeek: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface StoreConfig {
  id: string;
  name: string;
  slogan: string;
  description: string;
  logo: string;
  coverImage: string;
  whatsapp: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    referencePoint?: string;
  };
  delivery: {
    fee: number;
    freeDeliveryAbove?: number;
    estimatedTimeMin: number;
    estimatedTimeMax: number;
    radiusKm: number;
    pickupTimeMin: number;
    pickupTimeMax: number;
  };
  openingHours: StoreHours[];
  paymentMethods: {
    id: string;
    name: string;
    type: 'pix' | 'credit' | 'debit' | 'cash';
    description?: string;
  }[];
  social: {
    instagram?: string;
    facebook?: string;
  };
}

export interface Order {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  deliveryType: 'delivery' | 'pickup';
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    city: string;
    referencePoint?: string;
  };
  paymentMethod: string;
  changeFor?: number;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  specialInstructions?: string;
  status: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  createdAt: string;
}
