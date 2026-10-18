# Padrão Refinatto — reconstrução do template

Engenharia reversa de `padrao-refinatto-previa.vercel.app`, extraída do deploy em 18/10/2026.

**Fidelidade:** `index.html`, `assets/css/style.css` e `assets/js/main.js` são idênticos ao original (SHA-256 conferido após normalizar CRLF → LF). Site estático puro: zero framework, zero dependência, zero build.

## Rodar

1. `bash scripts/baixar-assets.sh` (Mac/Linux) ou `scripts\baixar-assets.ps1` (Windows) — baixa as 18 imagens, 4 vídeos e 5 fontes originais (~2,3 MB).
2. Servir a pasta: `npx serve .` ou `python3 -m http.server`. Deploy: arrastar a pasta para a Vercel, sem configuração.

As fontes já vêm na pasta (Instrument Serif e Hanken Grotesk, via Fontsource, licença OFL). O script substitui pelas versões exatas do deploy.

## Arquitetura

```
index.html            18 KB · 5 seções + intro + header + footer + FAB
assets/css/style.css  18 KB · tokens em :root, BEM leve, 2 breakpoints (1000 / 760)
assets/js/main.js      6 KB · vanilla ES5, IntersectionObserver
assets/img            hero (desktop 2000×1120 / mobile), obras, detalhes, posters, logo, mark, favicon
assets/video          4 clipes 9:16 (~250–380 KB cada)
assets/fonts          woff2 self-hosted, preload de 2
```

## Design tokens

| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#0b0907` | fundo base, hero, orçamento, footer |
| `--ink2` | `#14100d` | Obras, card do formulário |
| `--char` | `#1c1713` | placeholder de imagem/vídeo |
| `--gold` | `#c9a15b` | botões, linhas, labels |
| `--gold-hi` | `#e0bd7c` | itálicos de título, hover, marca |
| `--gold-lo` | `#8e6f3e` | sublinhado de link, ripas |
| `--gold-ink` | `#6a4d20` | dourado sobre papel |
| `--paper` | `#ede5d8` | Etapas e Avaliações |
| `--paper-ink` | `#1a140e` | texto sobre papel |
| `--txt` / `--mute` | `#e9e1d3` / `#a99f8f` | texto principal / secundário no escuro |
| `--line` | `rgba(201,161,91,.24)` | bordas |

**Tipografia:** Instrument Serif 400 (+ itálico) para display; Hanken Grotesk 400/500/600 para interface. H1 `clamp(3.1rem, 8.6vw, 8.2rem)/.94`; H2 `clamp(2.5rem, 6.4vw, 5.6rem)/.98`; nota "5,0" `clamp(7rem, 22vw, 19rem)/.78`.

**Easing:** `--ease: cubic-bezier(.2,.7,.2,1)` (entradas) e `--slat: cubic-bezier(.76,0,.24,1)` (ripas). Grid: `.wrap` = `min(1240px, 100% − 2×gut)`, gut `clamp(20px, 5vw, 64px)`. Cantos retos em tudo (nenhum border-radius exceto o ponto de status).

## Ritmo de seções (alternância claro/escuro)

| # | Seção | Fundo | Mecânica |
|---|---|---|---|
| 0 | Intro | ink | 8 ripas sobem em cascata revelando o hero |
| 1 | Hero | ink + foto | máscara de linha no H1, zoom-out 1.1→1 da foto, selo 5,0 |
| 2 | Etapas | paper | 6 linhas com depoimento; palco sticky troca a foto por ripas |
| 3 | Obras | ink2 | mosaico 12 col assimétrico + 4 vídeos 9:16 |
| 4 | Avaliações | paper | "5,0" gigante + parede em 3 colunas (masonry por `columns`) |
| 5 | Orçamento | ink | chips → mensagem pronta no WhatsApp + status aberto/fechado |

Entre seções há um divisor `.ripas` (30 px de linhas verticais a cada 14 px que "crescem" de baixo ao entrar na tela) — é a assinatura visual do site.

## Sistema de movimento

**Intro (≈3 s, uma vez por sessão).** Logo aparece com scale .94→1 (0,25 s), linha dourada desenha (0,7 s), logo some (1,75 s), 8 ripas sobem com 65 ms de defasagem (1,85 s). Em 2,25 s o JS adiciona `.go` no hero; em 3,1 s remove a intro e grava `sessionStorage.prIntro`. Um script inline no `<head>` lê essa flag antes do CSS para não piscar a intro em recargas. Botão "Pular" disponível.

**Máscara de linha (`.ln`).** Cada linha do título é `overflow:hidden` com o `span` interno em `translateY(108%)`; ao receber `.go`/`.in` sobe em 1,15 s. A segunda linha atrasa 0,12 s.

**Reveal ao rolar.** Um único IntersectionObserver (threshold .12, margem inferior −6%) adiciona `.in` em `.rv`, `.ripas`, `.rev` e linhas de título. `.rv` ganha atraso escalonado `(i % 3) × 70 ms`.

**Cortina de ripas nas obras (`.rev`).** O JS injeta 6 `span.sl` em cada imagem; ao entrar, cada ripa encolhe para baixo com 75 ms de defasagem enquanto a foto desfaz o zoom 1.1→1 em 1,8 s.

**Palco das etapas.** Observer com `rootMargin: -42% 0 -42% 0` (faixa central da tela) define a linha ativa (opacidade .3→1). A troca de imagem: 6 ripas cobrem (500 ms) → troca a foto → descobrem; uma fila (`want`/`busy`) evita trocas sobrepostas em rolagem rápida. Abaixo de 1000 px o palco some e cada linha mostra sua própria foto.

**Header e FAB.** Header fica sólido após 24 px de rolagem; o botão flutuante do WhatsApp entra após 80% da altura da tela.

**Vídeos.** `preload="none"` + poster; tocam só com 35% visíveis e pausam ao sair.

## Conversão

- Todo `[data-wa]` recebe o link do WhatsApp com mensagem padrão.
- Formulário monta a mensagem a partir dos chips ("…orçamento de cozinha, quarto e banheiro.") + observações, e abre o WhatsApp. Nada é enviado sem confirmação do usuário.
- Status em tempo real no fuso de Brasília (seg–sex, 8h30–17h30): "Atendendo agora" com ponto verde, ou "Fechados agora… respondem hoje/amanhã/segunda às 8h30".
- Prova social em 3 camadas: selo no hero, depoimentos dentro do processo, parede de avaliações. Links para o Google Maps (`cid=1270631015792055401`).

## Para reaproveitar como template em outro cliente

1. Trocar tokens em `:root` (as 4 famílias: ink, gold, paper, txt) e as fontes nos `@font-face`.
2. Trocar `WA` no topo do `main.js` e os `href` com `wa.me` no HTML; ajustar o texto `base` e a frase do formulário.
3. Horário: constantes `510` (8h30) e `1050` (17h30) em minutos no bloco de status, e os textos no HTML/JSON-LD.
4. Etapas: manter 6 `.row` com `data-img` na mesma ordem das 6 imagens do `.stage__frame`.
5. Mosaico: as classes `m--a`…`m--f` definem as posições; trocar só as imagens preserva a composição.
6. Remover `noindex, nofollow` e a nota de "Prévia de proposta" no rodapé quando for para produção.

## Observações técnicas

- O path do ícone do WhatsApp no FAB tem números como `1.300`, `1.500` — veio assim do original e foi mantido para fidelidade; renderiza normalmente.
- Não há `prefers-reduced-motion` no original. Se quiser endurecer acessibilidade, é o primeiro acréscimo a fazer.
- `robots.txt` e `vercel.json` não existem no deploy.
