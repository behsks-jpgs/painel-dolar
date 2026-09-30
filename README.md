# Painel do Dólar

Site em HTML, CSS e JavaScript que mostra a cotação do dólar (AwesomeAPI), servido com Node.js + Express e hospedado no Render.

## Estrutura

```
painel-dolar/
├── public/          ← o site (index.html, style.css, script.js)
├── server.js        ← servidor Express
├── package.json
└── .gitignore
```

## Rodar no computador

```bash
npm install
npm start
```

Abra http://localhost:3000

## Publicar no GitHub

```bash
git init
git add .
git commit -m "Painel do Dólar com Express"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/painel-dolar.git
git push -u origin main
```

## Publicar no Render

1. Em https://render.com, clique em **New +** → **Web Service**.
2. Conecte sua conta do GitHub e escolha o repositório `painel-dolar`.
3. Preencha:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Em **Environment Variables**, adicione:
   - `AWESOME_API_KEY` = sua chave da AwesomeAPI
5. Clique em **Create Web Service** e aguarde o deploy terminar.
6. O link público aparece no topo da página, no formato `https://painel-dolar-xxxx.onrender.com`.
