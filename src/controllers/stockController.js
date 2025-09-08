import { fetchStock, fetchSearch, fetchSearchTop10 } from "../services/stockService.js"

// Buscar uma ação específica
export async function getStock(req, res) {
    const ticker = req.params.ticker.toUpperCase();
    try {
        const data = await fetchStock(ticker);

        const quote = data.results[0];

        res.json({
            ticker: quote.symbol,
            shortName: quote.shortName,
            longName: quote.longName,
            logo: quote.logourl,
            regularMarketPrice: quote.regularMarketPrice,
            regularMarketChange: quote.regularMarketChange,
            regularMarketChangePercent: quote.regularMarketChangePercent,
            regularMarketDayHigh: quote.regularMarketDayHigh,
            regularMarketDayLow: quote.regularMarketDayLow,
            fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
            fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
            marketCap: quote.marketCap,
            priceEarnings: quote.priceEarnings ?? 0,
            earningsPerShare: quote.earningsPerShare ?? 0,
            historicalDataPrice: quote.historicalDataPrice
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function searchStocks(req, res) {
    const query = req.params.query.toUpperCase();
    try {
        const data = await fetchSearch(query);
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function searchTop10Stocks(req, res) {
    try {
        const url = `https://brapi.dev/api/quote/list?sortBy=volume&sortOrder=desc&limit=20&page=1&token=${process.env.BRAPI_KEY}`
        const data = await fetch(url);
        //const quote = data.stocks
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}