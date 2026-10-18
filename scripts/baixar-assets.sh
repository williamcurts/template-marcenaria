#!/usr/bin/env bash
# Baixa as imagens, vídeos e fontes originais do deploy para dentro de assets/.
# Uso (na raiz do projeto): bash scripts/baixar-assets.sh
set -e
BASE="https://padrao-refinatto-previa.vercel.app/assets"
cd "$(dirname "$0")/.."

IMGS="mark.png logo-full.png favicon.png hero-d.webp hero-m.webp
obra-criado.webp obra-aparador.webp obra-painel-tv.webp obra-quarto.webp obra-quarto-2.webp obra-escritorio.webp
det-ripado.webp det-prateleira.webp det-palhinha.webp
poster-painel.webp poster-quarto.webp poster-criado.webp poster-escritorio.webp"
VIDS="painel.mp4 quarto.mp4 criado.mp4 escritorio.mp4"
FONTS="instrument.woff2 instrument-italic.woff2 hanken-400.woff2 hanken-500.woff2 hanken-600.woff2"

mkdir -p assets/img assets/video assets/fonts
for f in $IMGS;  do echo "img   $f";  curl -fsSL "$BASE/img/$f"   -o "assets/img/$f"; done
for f in $VIDS;  do echo "video $f";  curl -fsSL "$BASE/video/$f" -o "assets/video/$f"; done
for f in $FONTS; do echo "font  $f";  curl -fsSL "$BASE/fonts/$f" -o "assets/fonts/$f"; done
echo "Pronto: 18 imagens, 4 vídeos, 5 fontes."
