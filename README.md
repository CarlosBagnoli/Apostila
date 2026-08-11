# Apostila

Pequeno site estático com material da apostila.

## Estrutura
- `INDEX.html` — página inicial
- `MODULO1.html` ... `MODULO8.html` — módulos do conteúdo
- `file.css` — estilos
- `assets/script.js` — scripts

## Como abrir localmente
1. Abra `index.html` diretamente no navegador (duplo-clique), ou
2. Sirva via um servidor HTTP local (recomendado):

```powershell
cd "c:\Users\Carlos Müller\Desktop\Daniel\APOSTILA"
python -m http.server 8000
# então abra http://localhost:8000
```

## Enviar para o GitHub
O repositório remoto já existe em:

https://github.com/CarlosBagnoli/Apostila.git

Se você já inicializou o Git localmente, rode:

```powershell
git add README.md
git commit -m "Add README"
git push origin main
```

Se ainda não inicializou, estes comandos criam o repositório local e enviam:

```powershell
git init -b main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/CarlosBagnoli/Apostila.git
git push -u origin main
```

## Publicar (GitHub Pages)
1. No repositório do GitHub vá em *Settings > Pages*.
2. Selecione a branch `main` e a pasta `/ (root)` como fonte.

## Autor
Carlos Bagnoli

---
Atualize este arquivo conforme desejar.
