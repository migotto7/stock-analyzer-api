import { Router } from "express";
import { getStock, searchStocks, searchTop10Stocks } from "../controllers/stockController.js"

const router = Router();

// Rota para buscar ação por ticker
router.get("/acoes/:ticker", getStock);

// Rota para autocomplete (sugestão de tickers)
router.get("/search/:query", searchStocks);

router.get("/search/top", searchTop10Stocks);

export default router;