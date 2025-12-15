import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Expense, Category, Currency } from '../types';
import { ExpenseItem } from '../components/ExpenseItem';
import { Search, Filter, X, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface HistoryProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  currency: Currency;
}

export const History: React.FC<HistoryProps> = ({ expenses, onDelete, onClearAll, currency }) => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
        if (filterCategory !== 'All' && e.category !== filterCategory) return false;
        return true;
    });
  }, [expenses, filterCategory]);

  // Group expenses by date
  const groupedExpenses = useMemo(() => {
    const groups: Record<string, Expense[]> = {};
    filteredExpenses.forEach(expense => {
        const dateKey = format(parseISO(expense.date), 'yyyy-MM-dd');
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(expense);
    });
    return groups;
  }, [filteredExpenses]);

  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const handleEdit = (expense: Expense) => {
    navigate('/add', { state: { expense } });
  };

  const handleClearAllClick = () => {
    if (expenses.length === 0) return;
    if (window.confirm("Clear all history?\n\nThis will delete all expenses permanently. Are you sure?")) {
      onClearAll();
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
       <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">History</h1>
        <div className="flex gap-2">
            {expenses.length > 0 && (
              <button
                onClick={handleClearAllClick}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
                aria-label="Clear All"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-full transition-colors ${showFilters ? 'bg-primary-100 text-primary-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm'}`}
            >
                <Filter size={20} />
            </button>
        </div>
      </header>

      {/* Filters Area */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by Category</span>
                {filterCategory !== 'All' && (
                    <button onClick={() => setFilterCategory('All')} className="text-xs text-red-500 flex items-center">
                        <X size={12} className="mr-1"/> Clear
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilterCategory('All')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        filterCategory === 'All' 
                        ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900' 
                        : 'bg-transparent border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400'
                    }`}
                >
                    All
                </button>
                {Object.values(Category).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            filterCategory === cat
                            ? 'bg-primary-500 text-white border-primary-500' 
                            : 'bg-transparent border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      )}

      <div className="space-y-6">
        {sortedDates.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
                <Search size={48} className="mb-4 opacity-50" />
                <p>No expenses found.</p>
            </div>
        ) : (
            sortedDates.map(date => (
                <div key={date}>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
                        {format(parseISO(date), 'EEEE, MMMM d')}
                    </h3>
                    <div className="space-y-3">
                        {groupedExpenses[date].map(expense => (
                            <ExpenseItem 
                                key={expense.id} 
                                expense={expense} 
                                onDelete={onDelete} 
                                onEdit={handleEdit}
                                currency={currency}
                            />
                        ))}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};