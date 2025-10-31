import fetch from "node-fetch";

// Função para buscar dados de uma ação
export async function fetchStock(ticker) {
    const now = Date.now();

    const url = `https://brapi.dev/api/quote/${ticker}?token=${process.env.BRAPI_KEY}&fundamental=true&range=1mo&interval=1d`;
    const stockResponse = await fetch(url);

    if (!stockResponse.ok) throw new Error("Erro ao buscar dados da ação");

    const stock = await stockResponse.json();

    return stock;
}

// Função para buscar sugestões de tickers
export async function fetchSearch(query) {
    const url = `https://brapi.dev/api/quote/list?search=${query}&token=${process.env.BRAPI_KEY}&type=stock`;
    const stocksResponse = await fetch(url);

    if(!stocksResponse.ok) throw new Error("Erro ao buscar sugestões");

    return stocksResponse.json();
}

// Função para buscar top 10 tickers
export async function fetchSearchTop10() {
    const url = `https://brapi.dev/api/quote/list?type=stock&sortBy=volume&sortOrder=desc&limit=20&page=1&token=${process.env.BRAPI_KEY}`
    const top10StocksResponse = await fetch(url);

    if(!top10StocksResponse.ok) throw new Error("Erro ao buscar sugestões");

    return top10StocksResponse.json();
}