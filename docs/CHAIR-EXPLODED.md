# Cadeira — estudo de exploded view

## Arquivos

- `assets/blender/chair-original.blend`: cópia da cena aberta pelo usuário antes das alterações, incluindo os objetos originais.
- `assets/blender/refinatto-chair-exploded.blend`: estudo editável, câmera e iluminação, salvo no quadro 185.
- `public/models/refinatto-chair.glb`: cinco grupos animados, textura incorporada, sem câmera, luzes ou cubo padrão.
- `assets/blender/chair-assembled.png` e `chair-exploded.png`: renders de revisão.
- `assets/blender/chair-glb-validation.json`: resultado da verificação do GLB.

## Limite do asset original

A cadeira importada é `geometry_0`: 8.584 vértices, 12.944 polígonos e uma textura de 1024 × 1024. As 187 ilhas topológicas se conectam ao considerar vértices coincidentes. Não há peças de fabricação independentes nem ferragens internas modeladas.

Esta versão é um **estudo conceitual**, com cortes nos pés, sem representação de encaixes reais. Assento, braços, encosto e parte superior da estrutura permanecem juntos. Não usar como desenho construtivo. Uma desmontagem completa e fiel exige remodelar esses componentes e suas superfícies internas.

## Grupos exportados

- `chairBody`
- `frontLeftLeg`
- `frontRightLeg`
- `rearLeftLeg`
- `rearRightLeg`

As texturas externas foram preservadas. As superfícies novas dos cortes usam um material simples de nogueira. A orientação do estudo usa os eixos locais da malha original, corrigindo a transformação inclinada da cena importada.

## Timeline

30 fps, quadros 1–330:

| Quadros | Momento |
| --- | --- |
| 1–40 | Cadeira montada |
| 40–125 | Corpo superior se afasta gradualmente |
| 85–165 | Pés se afastam para baixo e para fora |
| 165–220 | Pausa desmontada |
| 220–300 | Recomposição |
| 300–330 | Cadeira montada |

O GLB contém um único clip chamado `Refinatto | Chair exploded study`, com aproximadamente 10,97 segundos. Os cinco grupos têm deslocamentos independentes e retornam às posições iniciais. A cena de iluminação está no `.blend`; não faz parte do GLB.

No Blender, use os controles de reprodução na timeline ou arraste o quadro atual. O quadro 1 mostra a cadeira montada e o quadro 185 mostra a desmontagem.

## Reprodução e validação

`scripts/blender/build_chair_exploded.py` gera o estudo a partir de `chair-original.blend`, em um processo separado do Blender. `scripts/blender/validate_chair_glb.py` verifica cabeçalho, cena, grupos, clip, deslocamentos, retorno ao estado montado e textura incorporada.

A integração na landing page ainda não foi feita. O mapeamento existente para o armário não é compatível com estes nomes e não foi substituído nesta etapa.
