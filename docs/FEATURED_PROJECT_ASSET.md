# Asset da seção Projeto Destaque

A seção 04 (Projeto Destaque) espera a fotografia definitiva em:

- `public/images/project-featured.jpg`

Enquanto o arquivo não existir, a seção usa um gradiente de fallback
elegante (tons de nogueira sobre obsidian com grão sutil) para que o
scroll e a expansão continuem funcionando sem quebrar o layout.

A fotografia ideal deve mostrar:

- ambiente residencial completo (não um móvel isolado)
- marcenaria sob medida em primeiro plano
- iluminação arquitetônica
- madeira escura ou natural (nogueira)
- pedra ou outros materiais nobres complementares
- composição contemporânea, enquadramento horizontal
- acabamento sofisticado, compatível com a direção visual da marca

Após adicionar o arquivo definitivo, um novo build é necessário para que
`existsSync` detecte o asset e a seção passe a renderizar a imagem via
`next/image`.
