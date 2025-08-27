import fetch from "node-fetch";

const cache = {};

// Função para buscar dados de uma ação
export async function fetchStock(ticker) {
    const now = Date.now();

    if (cache[ticker] && now - cache[ticker].timestamp < 300000) {
        return cache[ticker].data;
    }

    const url = `https://brapi.dev/api/quote/${ticker}?token=${process.env.BRAPI_KEY}`;
    const resp = await fetch(url);

    if (!resp.ok) throw new Error("Erro ao buscar dados da ação");

    const data = await resp.json();

    cache[ticker] = { data, timestamp: now };

    return data;
}

// Função para buscar sugestões de tickers
export async function fetchSearch(query) {
    const url = `https://brapi.dev/api/quote/list?search=${query}&token=${process.env.BRAPI_KEY}`;
    const resp = await fetch(url);

    if(!resp.ok) throw new Error("Erro ao buscar sugestões");

    return resp.json();
}