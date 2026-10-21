import React from "react";
import { MapPin, Clock, Star, Bike, Sparkles, MessageCircle, Flame } from "lucide-react";
import { defaultStoreConfig } from "@/lib/config/store.config";
import { formatCurrency } from "@/lib/utils";

export function Banner() {
  const { address, delivery, whatsapp } = defaultStoreConfig;

  return (
    <div className="relative overflow-hidden border-b border-[#2A2A2A] bg-gradient-to-b from-[#181818] via-[#121212] to-[#080808]">
      {/* Background Graphic Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FF7A00]/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-5xl px-4 py-6 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 px-3 py-1 text-xs font-semibold text-[#FF7A00]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Cardápio Oficial da Loja • Poá / SP</span>
            </div>

            <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wide leading-none">
              SMASH BURGERS <span className="text-[#FF7A00]">GIGANTES</span> NA CHAPA
            </h1>

            <p className="text-sm sm:text-base text-[#C4B59D] leading-relaxed">
              Pão brioche selado na manteiga, carnes suculentas de 120g até 360g prensadas com crostinha perfeita, muito cheddar cremoso e o molho exclusivo da Smash Legend.
            </p>

            {/* Badges Info */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs sm:text-sm text-[#F3E3C7]">
              <div className="flex items-center gap-1.5 font-medium">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>4.9</span>
                <span className="text-[#C4B59D]">(Avaliações em Poá)</span>
              </div>

              <div className="flex items-center gap-1.5 font-medium">
                <Bike className="h-4 w-4 text-[#FF7A00]" />
                <span>
                  {delivery.estimatedTimeMin}-{delivery.estimatedTimeMax} min
                </span>
                <span className="text-[#C4B59D]">• Taxa {formatCurrency(delivery.fee)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Entrega grátis acima de {formatCurrency(delivery.freeDeliveryAbove || 80)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Facade Banner & Store Info */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {/* Real Store Facade Banner Showcase */}
            <div className="relative overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414] shadow-card group">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src="/assets/aistudio/smashes_logo_a4050271.webp"
                  alt="Smash Legend Hamburgueria Fachada Oficial"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Flame className="h-4 w-4 text-[#FF7A00]" />
                    <span className="font-bebas text-sm tracking-wide">FACHADA OFICIAL</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold bg-black/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Aberto agora
                  </span>
                </div>
              </div>

              {/* Address details */}
              <div className="p-3.5 space-y-2.5">
                <div className="flex items-start gap-2 text-xs text-[#F3E3C7]">
                  <MapPin className="h-4 w-4 text-[#FF7A00] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">
                      {address.street}, {address.number}
                    </p>
                    <p className="text-[#C4B59D]">
                      {address.neighborhood} - {address.city}/{address.state}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] py-2.5 text-xs font-bold text-white transition-colors shadow-md"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Pedir no WhatsApp • (11) 94564-9048</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
