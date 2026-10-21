# BRASA BURGERS — Cardápio Digital & White Label Delivery

Sistema profissional de cardápio digital para hamburguerias com experiência **Mobile First**, carrinho reativo em tempo real e finalização direta de pedidos via **WhatsApp**.

Desenvolvido com arquitetura **SaaS White Label** modular e escalável, permitindo fácil personalização da marca por outros desenvolvedores, franqueados e estabelecimentos gastronômicos. Atualmente configurado e customizado para a **SMASH LEGEND Hamburgueria** (Poá - SP).

---

## 📱 Principais Funcionalidades

- **Cardápio Digital Mobile First:** Interface ultra-rápida, intuitiva e otimizada para smartphones e navegadores desktop.
- **Categorização Completa:** Navegação por categorias (Smashes, Porções & Acompanhamentos, Bebidas, etc.).
- **Visualização & Proporções das Imagens:**
  - Enquadramento inteligente que não corta hambúrgueres nem garrafas de bebidas.
  - Fundo escuro elegante com iluminação radial suave para garrafas e latas.
- **Carrinho de Compras Interativo (Drawer):**
  - Adição, remoção e ajuste de quantidades com cálculos instantâneos de subtotal, taxa de entrega e total.
  - Barra de progresso para frete grátis.
  - Campo para observações e preferências no pedido.
- **Checkout Direto via WhatsApp:**
  - Montagem automática de mensagem formatada com lista de itens, adicionais, endereço de entrega ou retirada no balcão e forma de pagamento escolhida (PIX, Cartão de Crédito/Débito ou Dinheiro com troco).
- **Painel Administrativo & Gestor de Pedidos:**
  - Interface para acompanhamento em `/admin`.
- **Modo Offline & Demonstração:**
  - Operação 100% funcional localmente via `data/cardapio-demo.json`, pronta para conexão com Supabase/PostgreSQL quando desejado.

---

## 🎨 Identidade Visual & Design System

- **Background:** `#080808` (Dark Premium)
- **Superfícies & Cards:** `#1C1C1C` / `#141414`
- **Laranja Principal (Primary):** `#FF6A00`
- **Vermelho Secundário (Accent):** `#E6391F`
- **Creme de Apoio:** `#F3E3C7`
- **Bordas Sutis:** `#2A2A2A`
- **Tipografia:**
  - `Bebas Neue`: Títulos de grande impacto, badges, destaques promocionais e preços.
  - `Inter`: Navegação, textos descritivos dos lanches, formulários e interface do usuário.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com tokens de design compatíveis com shadcn/ui
- **Animações:** Motion (`motion/react`)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand) (Carrinho de compras reativo e persistente)
- **Manipulação de Imagens:** Sharp
- **Integração de Dados:** Camada desacoplada pronta para Supabase com fallback transparente para modo demo (`data/cardapio-demo.json`)

---

## 📂 Estrutura de Diretórios

```
├── app/
│   ├── (store)/               # Rotas públicas do cardápio digital
│   ├── admin/                 # Painel administrativo de pedidos
│   ├── globals.css            # Design tokens HSL, reset e utilitários Tailwind
│   └── layout.tsx             # Layout raiz, fontes Google (Bebas Neue & Inter) e metadados
├── components/
│   ├── ui/                    # Componentes base (Button, Badge, SmashLegendLogo, etc.)
│   ├── layout/                # Header/Navbar, Banner, Footer e estrutura
│   ├── store/                 # Componentes específicos do cardápio (ProductCard, ProductModal, CategoryBar)
│   ├── cart/                  # Componentes do carrinho de compras (CartDrawer, CartItem, etc.)
│   └── admin/                 # Componentes do painel administrativo
├── data/
│   ├── cardapio-demo.json     # Dados completos do cardápio no modo de demonstração
│   └── assets-manifest.json   # Manifesto de assets e mídias
├── lib/
│   ├── config/                # Configuração centralizada White Label (store.config.ts)
│   ├── data/                  # Camada de abstração de dados (demo / Supabase)
│   ├── store/                 # Gerenciamento de estado Zustand (useCartStore)
│   ├── supabase/              # Clientes Supabase (browser e server)
│   └── utils.ts               # Utilitários gerais (cn, formatCurrency, etc.)
├── public/
│   ├── assets/                # Assets oficiais da marca (logotipos, fotos reais, fachada)
│   └── images/                # Assets locais organizados (produtos, combos, banners)
└── types/
    └── store.ts               # Definições TypeScript estritas de produtos, pedidos e loja
```

---

## 🚀 Como Executar Localmente

### 1. Clonar o repositório ou abrir o projeto:
```bash
git clone <url-do-repositorio>
cd <pasta-do-projeto>
```

### 2. Instalar as dependências:
```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador (recomenda-se abrir as Ferramentas do Desenvolvedor `F12` e alternar para a visualização mobile para testar a experiência completa).

### 4. Executar a verificação de tipos e build de produção:
```bash
npm run build
```

Para iniciar a versão de produção após o build:
```bash
npm run start
```

---

## 🏷️ Configuração White Label

Toda a identidade e parâmetros do estabelecimento estão centralizados em `lib/config/store.config.ts`, permitindo que qualquer estabelecimento ou desenvolvedor altere facilmente:

- **Nome e slogan do restaurante:** ex: `SMASH LEGEND`
- **Logotipo e Identidade:** Caminho da imagem oficial ou SVG dinâmico
- **Cores da marca:** Variáveis configuráveis
- **Telefone do WhatsApp:** Número internacional com DDD (ex: `5511945649048`) para recebimento automático dos pedidos
- **Endereço físico e ponto de referência:** Utilizado no cabeçalho, rodapé e cálculo de entregas
- **Horários de funcionamento:** Definição por dia da semana com verificação automática de loja aberta/fechada
- **Taxas e regras de entrega:**
  - Valor da taxa padrão
  - Valor mínimo para frete grátis
  - Tempo estimado de entrega (min/max)
  - Tempo estimado de retirada no balcão (min/max)
  - Raio máximo de entrega em km
- **Formas de pagamento aceitas:** PIX, Cartão de Crédito, Cartão de Débito e Dinheiro
- **Links de redes sociais:** Instagram, Facebook, etc.

---

## 🍔 Itens do Cardápio Cadastrados (Exemplo Smash Legend)

- **Burgers & Smashes:**
  - *Legend Simple Burger:* Pão brioche, 1 smash 80g, queijo cheddar fatiado, molho da casa.
  - *Legend Double Cheese:* Pão brioche, 2 smashes 80g, queijo cheddar fatiado em dobro, molho da casa.
  - *Legend Bacon:* Pão brioche, 2 smashes 80g, fatias crocantes de bacon, cheddar fatiado, molho especial.
  - *Legend Supreme:* Pão brioche, 2 smashes 80g, queijo cheddar, alface americana, tomate fresco, cebola roxa, picles e molho especial.
  - *Legend Big Chicken:* Pão brioche, filé de frango empanado crocante, queijo, alface e maionese artesanal.
  - *Legend Triple Bacon:* Pão brioche, 3 smashes 80g, muito queijo cheddar derretido e fatias generosas de bacon.
- **Porções:**
  - *Batata Frita Tradicional (400g)*
  - *Batata Frita com Cheddar Cremoso & Bacon (400g)*
  - *Onion Rings Crocantes (12 unidades)*
  - *Nuggets de Frango Crocantes (200g / 10 unidades)*
- **Bebidas:**
  - *Coca-Cola Original 2 Litros*
  - *Coca-Cola Original Lata 350ml*
  - *Água Mineral sem Gás 500ml*
  - *Suco Del Valle Uva 290ml*

---

## 📄 Licença

Distribuído sob licença comercial White Label para estabelecimentos parceiros e desenvolvedores.
