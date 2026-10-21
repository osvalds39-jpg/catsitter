# catsitter

Landing page estática (uma única página) para serviço de **cat sitting em São Paulo**: visitas por hora na casa do gato, com
vídeo de cada interação e contato por WhatsApp.

- **Stack:** HTML + CSS + JavaScript puros, sem dependências e sem build step real.
- **Hospedagem:** Cloudflare Pages (branch `main` → produção, preview automático por PR).
- **Conteúdo:** arquivos de dados em `data/` — sem CMS, atualizados com um commit.

---

## Rodando localmente

```bash
npm run dev     # build + servidor em http://localhost:4173
npm run build   # gera a pasta dist/
npm run serve   # só o servidor (servindo a dist/ já construída)
```

Não é necessário instalar nada: o projeto não tem dependências (`node_modules` não é usado).

---

## Estrutura

```
index.html                 página única com as 9 seções
assets/
  css/main.css             design system (tokens) + componentes
  js/main.js               menu, scroll-spy, reveal, bindings
  js/content.js            renderiza galeria, feed, depoimentos, preços, lightbox
  js/whatsapp.js           links de WhatsApp + formulário de pedido
  fonts/                   Poppins self-hosted (woff2, subset latin)
  img/                     imagens de exemplo (substituir pelas reais)
data/
  site.js                  configuração: WhatsApp, e-mail, redes, preços, galeria, stats
  posts.js                 feed de atualizações (atualização diária)
  testimonials.js          depoimentos autorizados
tools/
  build.mjs                monta dist/ ignorando specs/
  serve.mjs                 servidor local (aplica as regras do _headers)
specs/                     especificações do projeto (não é publicado)
```

---

## Atualização de conteúdo (sem CMS)

### 1. Novas atualizações do dia — `data/posts.js`

Adicione um objeto **no topo** da lista `window.CATSITTER_POSTS`:

```js
{
  date: '2026-10-21',
  type: 'visita',                 // visita | depoimento | artigo
  title: 'Visita à casa da Lina, em Pinheiros',
  cover: 'assets/img/post-1.jpg',  // opcional
  webp: 'assets/img/post-1.webp',  // opcional
  alt: 'Gato na janela durante a visita',
  body: 'Ração, água trocada e caixa limpa…',
  tags: ['alimentação'],
  placeholder: false,             // true exibe a etiqueta "Conteúdo de exemplo"
}
```

### 2. Depoimentos — `data/testimonials.js`

Só publique com `authorized: true` (autorização do tutor) e `placeholder: false`.

```js
{ name: 'Mariana A.', neighborhood: 'Moema', quote: '…', authorized: true, placeholder: false }
```

### 3. WhatsApp, e-mail, redes — `data/site.js`

```js
whatsapp: '5511999999999',        // DDI + DDD + número, só dígitos
whatsappDisplay: '(11) 99999-9999',
email: 'contato@…',
instagram: 'https://instagram.com/…',
```

Trocar o número aqui atualiza **todos** os botões, o link do rodapé, o formulário e o JSON-LD do schema.

### 4. Preços — `data/site.js`

A seção "Quanto custa cada visita" fica oculta com um aviso enquanto `prices` estiver vazio. Para publicar:

```js
prices: [
  { id: '30min', label: 'Visita de 30 minutos', price: 'R$ 45', note: 'Alimentação e caixa de areia' },
  { id: '45min', label: 'Visita de 45 minutos', price: 'R$ 60', note: 'Inclui brincadeira e vídeo', featured: true },
]
```

### 5. Galeria de visitas — `data/site.js`

```js
gallery: [
  { type: 'foto',  src: 'assets/img/cat-1.jpg', webp: 'assets/img/cat-1.webp', alt: '…', caption: '…' },
  { type: 'video', src: 'assets/video/visita-1.mp4', alt: '…', caption: 'Vídeo da interação' },
]
```

Vídeos com `type: 'video'` e arquivo `.mp4`/`.webm` são reproduzidos no lightbox.

Depois de qualquer alteração: `npm run build` e publique (commit + push).

---

## Checklist de assets reais (pendências)

| Item | Onde está | Situação |
| --- | --- | --- |
| Foto do cuidador com um gato | `assets/img/cuidador-placeholder.svg` | **placeholder** — substituir por `assets/img/cuidador.jpg` e apontar no `index.html` |
| Fotos das visitas | `assets/img/cat-1..7.jpg` | imagens de exemplo (Wikimedia Commons) |
| Vídeos de visita | `assets/video/` | ainda não existem |
| Logotipo | `favicon.svg` | provisório |
| Número do WhatsApp | `data/site.js` | **placeholder** `5511999999999` |
| Preços | `data/site.js` | vazio (seção escondida) |
| Depoimentos | `data/testimonials.js` | exemplos, aguardando autorização |

> As imagens atuais vêm do Wikimedia Commons com licenças livres (CC BY / CC BY-SA / CC0). Os créditos estão em
> `assets/img/CREDITOS.md`. Ao trocar por fotos próprias, apague esse arquivo e a linha de créditos no rodapé.

---

## Publicação (Cloudflare Pages)

**Produção:** https://catsitter.pages.dev/
**Projeto:** `catsitter` (branch de produção: `main`)

O deploy é feito por upload direto da pasta `dist/` (projeto Cloudflare Pages já criado):

```bash
npm run deploy    # build + wrangler pages deploy
```

Pré-requisito: estar autenticado no Cloudflare (`npx wrangler login`) — o token fica em
`%APPDATA%\xdg.config\.wrangler\config\default.toml`.

### Alternativa: deploy automático por push (Git)

Se você conectar o repositório em **Cloudflare Pages → Create project → Connect to Git**, cada push em `main` gera um deploy
automático — é a melhor opção para a atualização diária de conteúdo. Nesse caso:

- **Build command:** `node tools/build.mjs`
- **Build output directory:** `dist`

Os arquivos `_headers` e `_redirects` da raiz são copiados para `dist/` pelo build e aplicados pela plataforma.

> O `dist/` não é versionado (está no `.gitignore`): o build sempre o reconstrói.

---

## Decisões técnicas

- **Sem framework e sem dependências:** a página precisa carregar rápido e ser fácil de editar.
- **Conteúdo em `data/*.js`** (scripts clássicos, não módulos) para permitir abrir o `index.html` direto no navegador, sem servidor.
- **Poppins self-hosted** (~30 KB no total, subset latin) para não depender de terceiros em produção.
- **CSP restritivo** em `_headers` (`style-src 'self'`) — por isso não existem estilos inline no HTML; use as classes utilitárias
  (`mt-lg`, `mb-sm`, `mt-section`…).
- **Acessibilidade:** skip link, foco visível, `<details>` nativo no FAQ, `dialog` nativo no lightbox, alvos de toque ≥ 40 px,
  `prefers-reduced-motion` respeitado, um único H1 e `alt` em todas as imagens.
- **SEO:** meta tags, Open Graph, canonical, JSON-LD (`PetService`/`LocalBusiness`), `sitemap.xml`, `robots.txt` e manifest.
