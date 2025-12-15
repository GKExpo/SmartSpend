import React, { useMemo, useEffect, useState } from 'react';
import { Expense, CurrencySettings, ExchangeRates, CURRENCY_SYMBOLS } from '../types';
import { isSameDay, isSameWeek, isSameMonth, startOfWeek, format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Wallet, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import { fetchRates, convertCurrency } from '../services/currency';

interface HomeProps {
  expenses: Expense[];
  currencySettings: CurrencySettings;
}

const SummaryCard: React.FC<{ 
  title: string; 
  amount: number; 
  icon: React.ReactNode; 
  color: string;
  currencySettings: CurrencySettings;
  rates: ExchangeRates | null;
}> = ({ title, amount, icon, color, currencySettings, rates }) => {
  const baseSymbol = CURRENCY_SYMBOLS[currencySettings.base];

  return (
    <div className={`flex flex-col p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      <span className="text-2xl font-bold text-gray-900 dark:text-white">
        {baseSymbol} {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      {/* Converted Totals */}
      {currencySettings.display.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 space-y-0.5">
          {currencySettings.display.map(curr => {
            if (curr === currencySettings.base) return null;
            const converted = convertCurrency(amount, currencySettings.base, curr, rates);
            if (converted === null) return null;
            return (
              <div key={curr} className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                <span>≈ {CURRENCY_SYMBOLS[curr]}</span>
                <span>{converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Home: React.FC<HomeProps> = ({ expenses, currencySettings }) => {
  const now = new Date();
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);

  useEffect(() => {
    const loadRates = async () => {
        setLoadingRates(true);
        const data = await fetchRates(currencySettings.base);
        setRates(data);
        setLoadingRates(false);
    };
    loadRates();
  }, [currencySettings.base]);

  const stats = useMemo(() => {
    let today = 0;
    let week = 0;
    let month = 0;

    expenses.forEach(e => {
      const d = parseISO(e.date);
      if (isSameDay(d, now)) today += e.amount;
      if (isSameWeek(d, now, { weekStartsOn: 1 })) week += e.amount;
      if (isSameMonth(d, now)) month += e.amount;
    });

    return { today, week, month };
  }, [expenses]);

  const weeklyData = useMemo(() => {
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const data = Array(7).fill(0).map((_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return {
        day: format(d, 'EEE'),
        fullDate: d,
        amount: 0
      };
    });

    expenses.forEach(e => {
      const d = parseISO(e.date);
      if (isSameWeek(d, now, { weekStartsOn: 1 })) {
        const dayIndex = (d.getDay() + 6) % 7; // Adjust for Monday start
        if (data[dayIndex]) {
          data[dayIndex].amount += e.amount;
        }
      }
    });

    return data;
  }, [expenses]);

  return (
    <div className="space-y-6 pb-20 pt-4 px-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
             {loadingRates ? 'Updating rates...' : `Rates: ${rates ? format(new Date(rates.lastUpdated), 'MMM d, h:mm a') : 'Offline'}`}
          </p>
        </div>
        <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
           <Wallet size={20} />
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <SummaryCard 
          title="Today" 
          amount={stats.today} 
          icon={<div className="p-1.5 bg-green-100 text-green-600 rounded-lg"><TrendingUp size={16} /></div>}
          color="bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-900/10"
          currencySettings={currencySettings}
          rates={rates}
        />
        <SummaryCard 
          title="This Week" 
          amount={stats.week} 
          icon={<div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Calendar size={16} /></div>}
          color="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/10"
          currencySettings={currencySettings}
          rates={rates}
        />
        <div className="col-span-2">
            <SummaryCard 
            title="This Month" 
            amount={stats.month} 
            icon={<div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><Wallet size={16} /></div>}
            color="bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/10"
            currencySettings={currencySettings}
            rates={rates}
            />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Activity ({CURRENCY_SYMBOLS[currencySettings.base]})</h2>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="amount" radius={[6, 6, 6, 6]} barSize={30}>
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#10b981' : '#e5e7eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
