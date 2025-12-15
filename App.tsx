import React, { useState, useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { NavBar } from './components/NavBar';
import { Home } from './pages/Home';
import { AddExpense } from './pages/AddExpense';
import { History } from './pages/History';
import { Settings } from './pages/Settings';

import {
  getExpenses,
  saveExpense,
  deleteExpense,
  clearAllExpenses,
  getTheme,
  saveTheme,
  getCurrencySettings,
  saveCurrencySettings,
} from './services/storage';

import { Expense, CurrencySettings } from './types';

/* ---------------- Layout ---------------- */

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // HashRouter-safe navbar hide
  const hideNav = location.hash === '#/add';

  return (
    <div className="h-[100dvh] w-full bg-gray-100 dark:bg-gray-900 flex justify-center overflow-hidden">
      <div className="w-full max-w-md h-full bg-gray-50 dark:bg-gray-900 shadow-2xl flex flex-col relative">
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          {children}
        </main>
        {!hideNav && <NavBar />}
      </div>
    </div>
  );
};

/* ---------------- App ---------------- */

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [currencySettings, setCurrencySettings] =
    useState<CurrencySettings>(getCurrencySettings());

  useEffect(() => {
    setExpenses(getExpenses());

    const theme = getTheme();
    setIsDark(theme === 'dark');
    saveTheme(theme);

    setCurrencySettings(getCurrencySettings());
  }, []);

  const handleSaveExpense = (expense: Expense) => {
    setExpenses(saveExpense(expense));
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Delete this expense?')) {
      setExpenses(deleteExpense(id));
    }
  };

  const handleToggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    saveTheme(newTheme);
  };

  const handleCurrencyChange = (settings: CurrencySettings) => {
    setCurrencySettings(settings);
    saveCurrencySettings(settings);
  };

  const handleClearAll = () => {
    clearAllExpenses();
    setExpenses([]);
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                expenses={expenses}
                currencySettings={currencySettings}
              />
            }
          />

          <Route
            path="/add"
            element={
              <AddExpense
                onSave={handleSaveExpense}
                currency={currencySettings.base}
              />
            }
          />

          <Route
            path="/history"
            element={
              <History
                expenses={expenses}
                onDelete={handleDeleteExpense}
                onClearAll={handleClearAll}
                currency={currencySettings.base}
              />
            }
          />

          <Route
            path="/settings"
            element={
              <Settings
                isDark={isDark}
                toggleTheme={handleToggleTheme}
                expenses={expenses}
                onClearAll={handleClearAll}
                currencySettings={currencySettings}
                onCurrencyChange={handleCurrencyChange}
              />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
