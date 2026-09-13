# Refinatto Marcenaria — decisões do projeto

## Stack

- Next.js 16
- React 19.2 (compatível com o ecossistema 3D atual)
- TypeScript strict
- App Router

## Animação

- GSAP + ScrollTrigger para narrativa e scroll
- Lenis para smooth scrolling
- Framer Motion apenas para microinterações
- Three.js / React Three Fiber para 3D

Toda animação deve ser local à seção que a utiliza, desmontável e compatível
com `prefers-reduced-motion`. Não há animação global sem uma necessidade
concreta de produto.

## Direção visual

| Token | Valor |
| --- | --- |
| Obsidian | `#0B0B0A` |
| Bone | `#F1EEE7` |
| Walnut | `#7A4E32` |
| Amber | `#C99A5A` |
| Stone | `#A8A49A` |

## Tipografia

- Cormorant Garamond para display
- Manrope para UI e texto

## Primeira cena

O primeiro incremento visual é o hero cinematográfico com o vídeo disponível
em `midia/`, navbar, tipografia, overlay, transição de scroll e comportamento
mobile. Os assets finais devem ser publicados nas pastas correspondentes em
`public/` quando a cena for implementada.

## Cena 3D — Precisão

O asset definitivo deve ser publicado em
`public/models/refinatto-cabinet.glb`. Enquanto ele não existir, a seção usa
um módulo geométrico conceitual para validar câmera, iluminação, labels e a
timeline de scroll.

O GLB deve preservar materiais e manter as peças que participam da explosão
como objetos separados. O mapeamento e os aliases aceitos ficam centralizados
em `scenes/exploded-view/cabinetParts.ts`. Os nomes preferenciais são:

- `carcass`
- `leftDoor` e `rightDoor`
- `drawer01` e `drawer02`
- `shelf01` e `shelf02`
- `handle01` e `handle02`
- `hardware`
- `ledStrip`

Após adicionar ou substituir o GLB, é necessário executar um novo build para
que a disponibilidade do modelo seja detectada. A flag interna
`DEBUG_EXPLODED_VIEW` pode ser ativada localmente para inspecionar os nomes dos
meshes; ela permanece desativada por padrão.
