# Correção e Otimização do Enquadramento de Todas as Imagens — Smash Legend

Plano detalhado para corrigir o enquadramento, cortes e proporções de todas as imagens dos produtos nos cards e modais, garantindo que garrafas de bebidas (Coca-Cola 2L, Água Mineral 500ml, latas) apareçam completas da tampa à base sobre um fundo escuro elegante integrado, e que todos os hambúrgueres e porções tenham enquadramento centralizado, limpo e sem cortes indesejados.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Decisões confirmadas com o usuário:
> - **Enquadramento Adaptativo**: Ajustar a proporção e modo de exibição nos cards para evitar cortes de garrafas altas e hambúrgueres.
> - **Exibição de Bebidas e Garrafas**: Exibir as garrafas inteiras sem cortes (`object-contain` com padding cuidadoso e fundo escuro harmonizado com a paleta preta da Smash Legend).

---

## 1. Overview & Core Concept

- **O que faz**: Corrige o layout visual dos cards de produtos (`ProductCard.tsx`), modal de personalização (`ProductModal.tsx`), carrinho (`CartDrawer.tsx`) e painel administrativo (`AdminDashboard.tsx`), aplicando tratamento visual diferenciado e inteligente para cada tipo de produto (hambúrgueres, porções e garrafas/bebidas).
- **Problema resolvido**: Atualmente a regra `object-cover` força o corte da tampa e da base da garrafa de 2 litros de Coca-Cola e da garrafa de água, além de cortar detalhes de alguns hambúrgueres.
- **Resultado esperado**: Cada produto será visualizado com clareza total, estética gastronômica de alto nível e consistência profissional.

---

## 2. User Experience & Visual Design

### Ajustes nos Cards de Produto (`ProductCard.tsx`)
- **Container de Imagem Aprimorado**:
  - Proporção ajustada com altura confortável (`aspect-[4/3]`).
  - Fundo escuro texturizado com gradiente sutil (`from-[#1A1A1A] to-[#0E0E0E]`) para acomodar imagens de garrafas e fundos escuros perfeitamente.
  - Para bebidas (`categoryId === 'bebidas'`): aplicação de `object-contain p-2` para que garrafas de 2L e 500ml apareçam 100% visíveis, sem nenhum corte de tampa ou base.
  - Para hambúrgueres e porções: centralização otimizada com foco nos ingredientes suculentos e queijo derretido.

### Ajustes no Modal de Detalhes e Personalização (`ProductModal.tsx`)
- Container principal da imagem com altura equilibrada (`h-64 sm:h-72 w-full bg-[#0A0A0A] flex items-center justify-center p-3`).
- Efeito de vinheta radial escura para realçar o brilho das garrafas e o queijo dos smash burgers.
- Badges reposicionados para não sobrepor o produto principal.

### Ajustes nos Recortes e Assets Locais
- Refinamento das imagens recortadas do panfleto (`legend_double_cheddar_crop.jpg` e `legend_onion_crop.jpg`) com margens precisas sem bordas pretas excedentes.
- Verificação de renderização em todos os tamanhos de tela (mobile e desktop).

---

## 3. Key Product Decisions & Trade-Offs

- **Tratamento Inteligente por Tipo de Produto**:
  - *Abordagem*: Hambúrgueres mantêm destaque gastronômico imersivo, enquanto garrafas e latas utilizam contenção sem corte (`object-contain`) com padding e fundo neutro escuro.
  - *Por que*: Garrafas são naturalmente verticais (proporção 9:16 ou 1:2); forçar `object-cover` em cards 4:3 sempre decepa o topo e o fundo. A abordagem mista resolve isso de forma elegante.

---

## 4. Technical Architecture & Component Mapping

```
┌────────────────────────────────────────────────────────┐
│               Image Presentation Pipeline              │
│                                                        │
│  Product Image Input (Burger, Portion, or Bottle)      │
│                       │                                │
│                       ▼                                │
│          Category / Aspect Ratio Check                 │
│         ┌─────────────┴─────────────┐                  │
│         ▼                           ▼                  │
│   [Bebidas / Bottles]      [Burgers & Porções]         │
│   • object-contain          • object-cover             │
│   • p-3 padding             • centered focus           │
│   • #0E0E0E dark canvas     • rounded-xl radius        │
│         │                           │                  │
│         └─────────────┬─────────────┘                  │
│                       ▼                                │
│     Unified Responsive Product Card & Modal UI         │
└────────────────────────────────────────────────────────┘
```

- **Arquivos impactados na execução**:
  - `components/store/ProductCard.tsx` (estilo e enquadramento do card)
  - `components/store/ProductModal.tsx` (estilo e enquadramento do modal)
  - `components/cart/CartDrawer.tsx` (thumbnails do carrinho)
  - `components/admin/AdminDashboard.tsx` (thumbnails da tabela administrativa)
  - `data/cardapio-demo.json` (links de imagens refinados)

---

## Plan Verification Checklist
- [x] Resposta do usuário sobre garrafas completas e sem cortes integrada.
- [x] Regras de `frontend-design` e contraste respeitadas.
- [x] Zero código modificado nesta fase de planejamento.
