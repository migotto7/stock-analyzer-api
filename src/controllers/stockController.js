import { fetchStock, fetchSearch } from "../services/stockService.js"

// Buscar uma ação específica
export async function getStock(req, res) {
    const ticker = req.params.ticker.toUpperCase();
    try {
        const data = await fetchStock(ticker);
        res.json(data);
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