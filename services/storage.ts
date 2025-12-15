import { Expense, CurrencySettings, Currency, ExchangeRates } from '../types';

const STORAGE_KEY = 'smartspend_expenses';
const THEME_KEY = 'smartspend_theme';
const CURRENCY_KEY = 'smartspend_currency';
const RATES_KEY = 'smartspend_rates';

export const getExpenses = (): Expense[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load expenses", e);
    return [];
  }
};

export const saveExpense = (expense: Expense): Expense[] => {
  const current = getExpenses();
  const index = current.findIndex(e => e.id === expense.id);
  
  let updated;
  if (index >= 0) {
    // Update existing
    updated = [...current];
    updated[index] = expense;
  } else {
    // Add new
    updated = [expense, ...current];
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteExpense = (id: string): Expense[] => {
  const current = getExpenses();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearAllExpenses = (): Expense[] => {
  localStorage.removeItem(STORAGE_KEY);
  return [];
};

export const getTheme = (): 'light' | 'dark' => {
  const theme = localStorage.getItem(THEME_KEY);
  if (theme === 'dark' || theme === 'light') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const saveTheme = (theme: 'light' | 'dark') => {
  localStorage.setItem(THEME_KEY, theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const getCurrencySettings = (): CurrencySettings => {
  try {
    const data = localStorage.getItem(CURRENCY_KEY);
    return data ? JSON.parse(data) : { base: Currency.INR, display: [] };
  } catch (e) {
    return { base: Currency.INR, display: [] };
  }
};

export const saveCurrencySettings = (settings: CurrencySettings) => {
  localStorage.setItem(CURRENCY_KEY, JSON.stringify(settings));
};

export const getCachedRates = (): ExchangeRates | null => {
  try {
    const data = localStorage.getItem(RATES_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const saveCachedRates = (rates: ExchangeRates) => {
  localStorage.setItem(RATES_KEY, JSON.stringify(rates));
};