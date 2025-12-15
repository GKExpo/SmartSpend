export enum Category {
  Food = 'Food',
  Travel = 'Travel',
  Shopping = 'Shopping',
  Bills = 'Bills',
  Entertainment = 'Entertainment',
  Others = 'Others'
}

export enum Currency {
  INR = 'INR',
  JPY = 'JPY',
  GBP = 'GBP',
  USD = 'USD',
  EUR = 'EUR'
}

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  note: string;
  date: string; // ISO String
}

export interface CurrencySettings {
  base: Currency;
  display: Currency[];
}

export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
  lastUpdated: number;
}

export interface DateFilter {
  type: 'day' | 'week' | 'month' | 'all';
  value?: Date;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.Food]: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  [Category.Travel]: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  [Category.Shopping]: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  [Category.Bills]: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  [Category.Entertainment]: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  [Category.Others]: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  [Category.Food]: 'Utensils',
  [Category.Travel]: 'Plane',
  [Category.Shopping]: 'ShoppingBag',
  [Category.Bills]: 'Receipt',
  [Category.Entertainment]: 'Clapperboard',
  [Category.Others]: 'MoreHorizontal',
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.INR]: '₹',
  [Currency.JPY]: '¥',
  [Currency.GBP]: '£',
  [Currency.USD]: '$',
  [Currency.EUR]: '€'
};
