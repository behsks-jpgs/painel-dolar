const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// A chave da AwesomeAPI fica no servidor (variável de ambiente no Render),
// assim ela não aparece no GitHub nem no navegador de quem visita o site.
const CHAVE_API = process.env.AWESOME_API_KEY || "";

// Rota que busca as cotações na AwesomeAPI e devolve para o front-end
app.get("/api/cotacoes", async (req, res) => {
    let endereco = "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL";

    if (CHAVE_API) {
        endereco += "?token=" + CHAVE_API;
    }

    try {
        const resposta = await fetch(endereco);
        const dados = await resposta.json();
        res.status(resposta.status).json(dados);
    } catch (erro) {
        res.status(502).json({ erro: "Não foi possível consultar a AwesomeAPI" });
    }
});

// Serve os arquivos do site (HTML, CSS e JavaScript) da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
