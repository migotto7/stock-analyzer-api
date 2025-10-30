import { jest, test } from '@jest/globals';
import request from 'supertest';

// Mock the stockService module so tests don't call external APIs
const mockFetchStock = jest.fn();
const mockFetchSearch = jest.fn();
const mockFetchSearchTop10 = jest.fn();

await jest.unstable_mockModule('../services/stockService.js', () => ({
  fetchStock: mockFetchStock,
  fetchSearch: mockFetchSearch,
  fetchSearchTop10: mockFetchSearchTop10,
}));

const { default: app } = await import('../app.js');

describe('Stock routes', () => {
  beforeEach(() => {
    mockFetchStock.mockReset();
    mockFetchSearch.mockReset();
    mockFetchSearchTop10.mockReset();
  });

  test('GET /api/acoes/:ticker returns formatted stock data for PETR4', async () => {
    const ticker = 'PETR4';
    const quote = {
      symbol: ticker,
      shortName: 'PETROBRAS',
      longName: 'Petróleo Brasileiro S.A. - Petrobras',
      logourl: 'https://brapi.dev/img/petr4.png',
      regularMarketPrice: 35.95,
      regularMarketChange: 0.45,
      regularMarketChangePercent: 1.27,
      regularMarketDayHigh: 36.12,
      regularMarketDayLow: 35.51,
      fiftyTwoWeekLow: 27.85,
      fiftyTwoWeekHigh: 38.41,
      marketCap: 468126531584,
      priceEarnings: 2.89,
      earningsPerShare: 12.44,
      historicalDataPrice: [],
    };

    mockFetchStock.mockResolvedValue({ results: [quote] });

    const res = await request(app).get(`/api/acoes/${ticker}`);

    expect(res.status).toBe(200);
    expect(res.body.ticker).toBe(ticker);
    expect(res.body.shortName).toBe(quote.shortName);
    expect(res.body.regularMarketPrice).toBe(quote.regularMarketPrice);
  });

  test('GET /api/acoes/:ticker return status 500 when ticker is invalid', async () => {
    mockFetchStock.mockRejectedValue(new Error('Ticker inválido'));
    const res = await request(app).get('/api/acoes/INVALID');
    expect(res.status).toBe(500);
  });

  test('GET /api/search/:query returns search results', async () => {
    const query = 'PETR';
    const searchResponse = { 
      stocks: [
        { symbol: 'PETR4', shortName: 'PETROBRAS PN', volume: 100000000 },
        { symbol: 'PETR3', shortName: 'PETROBRAS ON', volume: 80000000 }
      ]
    };

    mockFetchSearch.mockResolvedValue(searchResponse);

    const res = await request(app).get(`/api/search/${query}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(searchResponse);
  });

  test('GET /api/acoes/:ticker - error handling', async () => {
    mockFetchStock.mockRejectedValue(new Error('API error'));

    const res = await request(app).get('/api/acoes/INVALID');

    expect(res.status).toBe(500);
    expect(res.body.error).toBeTruthy();
  });

  test('GET /api/search/:query - error handling', async () => {
    mockFetchSearch.mockRejectedValue(new Error('API error'));

    const res = await request(app).get('/api/search/INVALID');

    expect(res.status).toBe(500);
    expect(res.body.error).toBeTruthy();
  });

  test('GET /api/search/top return top 10 stocks', async () => {
    const topStocks = {
      stocks: [
        { symbol: 'PETR4', name: 'PETROBRAS', close: 35.95, volume: 100000000 },
        { symbol: 'VALE3', name: 'VALE', close: 71.25, volume: 80000000 }
        // ... mais ações
      ]
    };
    mockFetchSearchTop10.mockResolvedValue(topStocks);
    const res = await request(app).get('/api/search/top');
    expect(res.status).toBe(200);
  });
});
