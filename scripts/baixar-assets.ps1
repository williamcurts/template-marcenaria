# Baixa as imagens, vídeos e fontes originais do deploy para dentro de assets\.
# Uso (PowerShell, na raiz do projeto): powershell -ExecutionPolicy Bypass -File scripts\baixar-assets.ps1
$ErrorActionPreference = "Stop"
$Base = "https://padrao-refinatto-previa.vercel.app/assets"
Set-Location (Join-Path $PSScriptRoot "..")

$imgs = @("mark.png","logo-full.png","favicon.png","hero-d.webp","hero-m.webp",
  "obra-criado.webp","obra-aparador.webp","obra-painel-tv.webp","obra-quarto.webp","obra-quarto-2.webp","obra-escritorio.webp",
  "det-ripado.webp","det-prateleira.webp","det-palhinha.webp",
  "poster-painel.webp","poster-quarto.webp","poster-criado.webp","poster-escritorio.webp")
$vids  = @("painel.mp4","quarto.mp4","criado.mp4","escritorio.mp4")
$fonts = @("instrument.woff2","instrument-italic.woff2","hanken-400.woff2","hanken-500.woff2","hanken-600.woff2")

New-Item -ItemType Directory -Force -Path assets\img,assets\video,assets\fonts | Out-Null
foreach ($f in $imgs)  { Write-Host "img   $f"; Invoke-WebRequest "$Base/img/$f"   -OutFile "assets\img\$f" }
foreach ($f in $vids)  { Write-Host "video $f"; Invoke-WebRequest "$Base/video/$f" -OutFile "assets\video\$f" }
foreach ($f in $fonts) { Write-Host "font  $f"; Invoke-WebRequest "$Base/fonts/$f" -OutFile "assets\fonts\$f" }
Write-Host "Pronto: 18 imagens, 4 videos, 5 fontes."
