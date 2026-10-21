import { StoreConfig } from "@/types/store";

export const defaultStoreConfig: StoreConfig = {
  id: process.env.NEXT_PUBLIC_STORE_ID || "smash-legend-poa",
  name: process.env.NEXT_PUBLIC_STORE_NAME || "SMASH LEGEND",
  slogan: process.env.NEXT_PUBLIC_STORE_SLOGAN || "O autêntico smash burger de Poá",
  description: "Smash burgers artesanais suculentos prensados com crostinha crocante, muito queijo e molho exclusivo. Rua Ettore Vilardi, 270 - Vl Amélia - Poá.",
  logo: "/assets/aistudio/smashes_logo_a4050271.webp",
  coverImage: "/assets/aistudio/smashes_logo_a4050271.webp",
  whatsapp: process.env.NEXT_PUBLIC_STORE_WHATSAPP || "5511945649048",
  address: {
    street: "Rua Ettore Vilardi",
    number: "270",
    neighborhood: "Vl Amélia",
    city: "Poá",
    state: "SP",
    zipCode: "08557-000",
    referencePoint: "Próximo à praça da Vila Amélia",
  },
  delivery: {
    fee: 8.00,
    freeDeliveryAbove: 80.00,
    estimatedTimeMin: 30,
    estimatedTimeMax: 45,
    radiusKm: 12,
    pickupTimeMin: 20,
    pickupTimeMax: 30,
  },
  openingHours: [
    { dayOfWeek: "Terça-feira", open: "18:00", close: "23:30", isOpen: true },
    { dayOfWeek: "Quarta-feira", open: "18:00", close: "23:30", isOpen: true },
    { dayOfWeek: "Quinta-feira", open: "18:00", close: "23:30", isOpen: true },
    { dayOfWeek: "Sexta-feira", open: "18:00", close: "00:00", isOpen: true },
    { dayOfWeek: "Sábado", open: "18:00", close: "00:00", isOpen: true },
    { dayOfWeek: "Domingo", open: "18:00", close: "23:30", isOpen: true },
    { dayOfWeek: "Segunda-feira", open: "Fechado", close: "Fechado", isOpen: false },
  ],
  paymentMethods: [
    { id: "pix", name: "PIX (Chave na entrega ou QR)", type: "pix", description: "Envio de comprovante rápido" },
    { id: "credit", name: "Cartão de Crédito (na maquininha)", type: "credit", description: "Visa, Mastercard, Elo, Hipercard" },
    { id: "debit", name: "Cartão de Débito (na maquininha)", type: "debit", description: "Visa Electron, Maestro, Elo" },
    { id: "cash", name: "Dinheiro", type: "cash", description: "Informe se precisa de troco" },
  ],
  social: {
    instagram: "@smashlegend.poa",
    facebook: "/smashlegend",
  },
};

export function isStoreCurrentlyOpen(): boolean {
  return true;
}
