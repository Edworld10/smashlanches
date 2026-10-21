import { CartItem } from "@/types/store";
import { defaultStoreConfig } from "@/lib/config/store.config";
import { formatCurrency } from "@/lib/utils";

interface WhatsAppOrderParams {
  orderCode: string;
  customerName: string;
  customerPhone: string;
  deliveryType: "delivery" | "pickup";
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    referencePoint?: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  changeFor?: string;
  orderNotes?: string;
}

export function generateWhatsAppMessage(order: WhatsAppOrderParams): string {
  const lines: string[] = [];

  lines.push(`🍔 *PEDIDO ${order.orderCode} — ${defaultStoreConfig.name}*`);
  lines.push(`📅 ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`);
  lines.push("");

  lines.push(`👤 *Cliente:* ${order.customerName}`);
  lines.push(`📱 *Telefone:* ${order.customerPhone}`);
  lines.push(`📦 *Tipo:* ${order.deliveryType === "delivery" ? "🚀 Entrega Delivery" : "🛍️ Retirada no Balcão"}`);

  if (order.deliveryType === "delivery" && order.address) {
    lines.push("");
    lines.push(`📍 *Endereço de Entrega:*`);
    lines.push(`${order.address.street}, Nº ${order.address.number}`);
    lines.push(`Bairro: ${order.address.neighborhood}`);
    if (order.address.complement) lines.push(`Complemento: ${order.address.complement}`);
    if (order.address.referencePoint) lines.push(`Ponto de Ref.: ${order.address.referencePoint}`);
  }

  lines.push("");
  lines.push(`🛒 *ITENS DO PEDIDO:*`);
  order.items.forEach((item, index) => {
    lines.push(`\n*${item.quantity}x ${item.product.name}* — ${formatCurrency(item.totalPrice)}`);
    
    if (item.selectedCustomizations && item.selectedCustomizations.length > 0) {
      item.selectedCustomizations.forEach((customGroup) => {
        const optionNames = customGroup.items
          .map((i) => i.price > 0 ? `${i.name} (+${formatCurrency(i.price)})` : i.name)
          .join(", ");
        if (optionNames) {
          lines.push(`  ▫️ ${customGroup.groupName}: ${optionNames}`);
        }
      });
    }

    if (item.specialInstructions) {
      lines.push(`  ▫️ Obs: _${item.specialInstructions}_`);
    }
  });

  lines.push("");
  lines.push(`--------------------------------`);
  lines.push(`💵 *Subtotal:* ${formatCurrency(order.subtotal)}`);
  if (order.deliveryType === "delivery") {
    lines.push(`🛵 *Taxa de Entrega:* ${order.deliveryFee === 0 ? "GRÁTIS" : formatCurrency(order.deliveryFee)}`);
  }
  lines.push(`💰 *TOTAL:* *${formatCurrency(order.total)}*`);
  lines.push(`--------------------------------`);

  lines.push(`💳 *Forma de Pagamento:* ${order.paymentMethod.toUpperCase()}`);
  if (order.paymentMethod.toLowerCase().includes("dinheiro") && order.changeFor) {
    lines.push(`💵 *Troco para:* ${formatCurrency(Number(order.changeFor))}`);
  }

  if (order.orderNotes) {
    lines.push(`📝 *Observações Gerais:* ${order.orderNotes}`);
  }

  lines.push("");
  lines.push(`Aguardando confirmação do pedido! 🔥`);

  return lines.join("\n");
}

export function openWhatsAppCheckout(params: WhatsAppOrderParams, storePhone = defaultStoreConfig.whatsapp) {
  const message = generateWhatsAppMessage(params);
  const cleanPhone = storePhone.replace(/\D/g, "");
  const encodedText = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
  return url;
}
