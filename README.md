# 💘 Loveflix

App web (Next.js + React) que ajuda casais a decidirem **lanche, filme e sobremesa** da noite.

## Como funciona

1. Digitem os nomes do casal (opcional).
2. Adicionem **até 5 opções** em cada categoria (🍔 Lanche, 🎬 Filme, 🍰 Sobremesa) — digitando ou tocando nas sugestões.
3. Toquem em **✨ Gerar resultado**: uma animação estilo caça-níquel sorteia uma opção de cada categoria, com confete no final.
4. O resultado vira um **pôster em formato story (9:16)** que pode ser:
   - **Compartilhado como PDF** (folha de compartilhamento nativa do celular → WhatsApp, Instagram, etc.)
   - **Compartilhado como imagem** para os Stories do Instagram
   - Enviado como texto pelo **WhatsApp**
   - **Baixado em PDF**

As opções ficam salvas no navegador (localStorage).

> No desktop, onde o navegador não permite compartilhar arquivos, os botões fazem o download do PDF/PNG.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- `motion` (Framer Motion) para animações, `canvas-confetti`
- `html-to-image` + `jspdf` para gerar PNG/PDF no cliente
- Web Share API (`navigator.share` com arquivos)

## Rodando

```bash
npm install
npm run dev
```

Abra http://localhost:3000.
