// As cotações vêm do nosso servidor Express, que consulta a AwesomeAPI
const ENDERECO = "/api/cotacoes";

let dolarAtual = null;

function emReais(numero, casas) {
    return Number(numero).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: casas,
        maximumFractionDigits: casas
    });
}

function escreverTexto(id, texto) {
    document.getElementById(id).textContent = texto;
}

function criarCartao(titulo, valor, extra, classes) {
    const cartao = document.createElement("article");
    cartao.className = "cartao " + (classes || "");

    const elTitulo = document.createElement("span");
    elTitulo.className = "cartao-titulo";
    elTitulo.textContent = titulo;

    const elValor = document.createElement("strong");
    elValor.className = "cartao-valor";
    elValor.textContent = valor;

    cartao.appendChild(elTitulo);
    cartao.appendChild(elValor);

    if (extra) {
        const elExtra = document.createElement("span");
        elExtra.className = "cartao-extra " + extra.cor;
        elExtra.textContent = extra.texto;
        cartao.appendChild(elExtra);
    }

    return cartao;
}

function mostrarCartoes(usd) {
    const variacao = Number(usd.pctChange);
    const subiu = variacao >= 0;

    const area = document.getElementById("cartoes");
    area.innerHTML = "";

    area.appendChild(criarCartao("Dólar agora", emReais(usd.bid, 4), {
        texto: (subiu ? "▲ subiu " : "▼ caiu ") + Math.abs(variacao).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + "% no dia",
        cor: subiu ? "subiu" : "caiu"
    }, "principal"));

    area.appendChild(criarCartao("Máxima do dia", emReais(usd.high, 4), null, ""));
    area.appendChild(criarCartao("Mínima do dia", emReais(usd.low, 4), null, ""));
    area.appendChild(criarCartao("Preço de venda", emReais(usd.ask, 4), null, ""));
}

function mostrarFaixa(usd) {
    const minimo = Number(usd.low);
    const maximo = Number(usd.high);
    const atual = Number(usd.bid);
    const amplitude = maximo - minimo;

    let posicao = 50;

    if (amplitude > 0) {
        posicao = ((atual - minimo) / amplitude) * 100;
        posicao = Math.min(100, Math.max(0, posicao));
    }

    document.getElementById("faixa-marcador").style.left = posicao + "%";
    escreverTexto("faixa-min", "Mín. " + emReais(minimo, 4));
    escreverTexto("faixa-max", "Máx. " + emReais(maximo, 4));
    escreverTexto(
        "amplitude",
        "Hoje o dólar oscilou " + emReais(amplitude, 4) + " entre o menor e o maior valor."
    );
}

function mostrarOutrasMoedas(eur, btc) {
    const area = document.getElementById("outras-moedas");
    area.innerHTML = "";

    const lista = [
        { nome: "Euro", valor: emReais(eur.bid, 4) },
        { nome: "Bitcoin", valor: emReais(btc.bid, 2) }
    ];

    lista.forEach(function (moeda) {
        const bloco = document.createElement("div");
        bloco.className = "moeda";
        bloco.innerHTML = "<span></span><strong></strong>";
        bloco.querySelector("span").textContent = moeda.nome;
        bloco.querySelector("strong").textContent = moeda.valor;
        area.appendChild(bloco);
    });
}

function converter() {
    const campo = document.getElementById("entrada-dolar");
    const valorDigitado = Number(campo.value);

    try {
        localStorage.setItem("valorConversor", campo.value);
    } catch (e) {
    }

    if (dolarAtual === null || campo.value === "" || valorDigitado < 0) {
        escreverTexto("resultado-conversao", "--");
        return;
    }

    const emDolar = valorDigitado.toLocaleString("pt-BR", {
        style: "currency",
        currency: "USD"
    });

    escreverTexto(
        "resultado-conversao",
        emDolar + " = " + emReais(valorDigitado * dolarAtual, 2)
    );
}

function prepararConversor() {
    const campo = document.getElementById("entrada-dolar");

    try {
        const salvo = localStorage.getItem("valorConversor");

        if (salvo !== null) {
            campo.value = salvo;
        }
    } catch (e) {
    }

    campo.addEventListener("input", converter);
}

function guardarRolagem() {
    try {
        localStorage.setItem("posicaoRolagem", window.scrollY);
    } catch (e) {
    }
}

function restaurarRolagem() {
    try {
        const posicao = localStorage.getItem("posicaoRolagem");

        if (posicao !== null) {
            window.scrollTo(0, Number(posicao));
        }
    } catch (e) {
    }
}

window.addEventListener("beforeunload", guardarRolagem);

async function carregarCotacoes() {
    const status = document.getElementById("status");

    try {
        const resposta = await fetch(ENDERECO);

        if (!resposta.ok) {
            throw new Error("a API respondeu com erro " + resposta.status);
        }

        const dados = await resposta.json();
        const usd = dados.USDBRL;

        dolarAtual = Number(usd.bid);

        mostrarCartoes(usd);
        mostrarFaixa(usd);
        mostrarOutrasMoedas(dados.EURBRL, dados.BTCBRL);
        converter();

        status.textContent = "● Ao vivo";
        status.className = "status ok";

        escreverTexto(
            "rodape",
            "Cotação de " + usd.create_date + " · próxima atualização em 10 segundos"
        );
    } catch (erro) {
        status.textContent = "● Sem conexão";
        status.className = "status falhou";

        escreverTexto(
            "rodape",
            "Não consegui buscar a cotação: " + erro.message
        );
    } finally {
        restaurarRolagem();
    }
}

prepararConversor();
carregarCotacoes();