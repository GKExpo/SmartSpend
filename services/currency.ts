import { Currency, ExchangeRates } from '../types';
import { getCachedRates, saveCachedRates } from './storage';

const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

export const fetchRates = async (base: Currency): Promise<ExchangeRates | null> => {
  try {
    // Check cache first (valid for 6 hours)
    const cached = getCachedRates();
    const now = Date.now();
    const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

    if (cached && cached.base === base && (now - cached.lastUpdated < CACHE_DURATION)) {
      console.log('Using cached rates');
      return cached;
    }

    // Fetch from API
    console.log(`Fetching rates for ${base}...`);
    const response = await fetch(`${API_BASE_URL}/${base}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    const rates: ExchangeRates = {
      base: data.base,
      date: data.date,
      rates: data.rates,
      lastUpdated: now
    };

    saveCachedRates(rates);
    return rates;
  } catch (error) {
    console.error('Failed to fetch rates:', error);
    return getCachedRates(); // Return cache even if stale if fetch fails
  }
};

export const convertCurrency = (amount: number, from: Currency, to: Currency, rates: ExchangeRates | null): number | null => {
  if (from === to) return amount;
  if (!rates) return null;
  
  // API returns rates relative to Base.
  // If rates.base matches 'from', we just multiply.
  if (rates.base === from) {
    const rate = rates.rates[to];
    return rate ? amount * rate : null;
  }
  
  return null;
};