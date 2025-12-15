import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Home } from './pages/Home';
import { AddExpense } from './pages/AddExpense';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { getExpenses, saveExpense, deleteExpense, clearAllExpenses, getTheme, saveTheme, getCurrencySettings, saveCurrencySettings } from './services/storage';
import { Expense, CurrencySettings } from './types';

// Layout wrapper to conditionally hide navbar on specific pages
// Implements a "NestedScrollView" like behavior where main content scrolls inside the fixed app container
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideNav = location.pathname === '/add';

  return (
    <div className="h-[100dvh] w-full bg-gray-100 dark:bg-gray-900 flex justify-center overflow-hidden">
      <div className="w-full max-w-md bg-gray-50 dark:bg-gray-900 h-full shadow-2xl flex flex-col relative">
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth w-full relative">
          {children}
        </main>
        {!hideNav && <NavBar />}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [currencySettings, setCurrencySettings] = useState<CurrencySettings>(getCurrencySettings());

  useEffect(() => {
    // Load initial state
    setExpenses(getExpenses());
    const theme = getTheme();
    setIsDark(theme === 'dark');
    saveTheme(theme);
    setCurrencySettings(getCurrencySettings());
  }, []);

  const handleSaveExpense = (expense: Expense) => {
    const updated = saveExpense(expense);
    setExpenses(updated);
  };

  const handleDeleteExpense = (id: string) => {
    if(window.confirm('Delete this expense?')) {
        const updated = deleteExpense(id);
        setExpenses(updated);
    }
  };

  const handleToggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    saveTheme(newTheme);
  };

  const handleCurrencyChange = (newSettings: CurrencySettings) => {
    setCurrencySettings(newSettings);
    saveCurrencySettings(newSettings);
  };

  const handleClearAll = () => {
      clearAllExpenses();
      setExpenses([]);
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home expenses={expenses} currencySettings={currencySettings} />} />
          <Route path="/add" element={<AddExpense onSave={handleSaveExpense} currency={currencySettings.base} />} />
          <Route path="/history" element={<History expenses={expenses} onDelete={handleDeleteExpense} onClearAll={handleClearAll} currency={currencySettings.base} />} />
          <Route path="/settings" element={
            <Settings 
              isDark={isDark} 
              toggleTheme={handleToggleTheme} 
              expenses={expenses} 
              onClearAll={handleClearAll}
              currencySettings={currencySettings}
              onCurrencyChange={handleCurrencyChange}
            />
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;