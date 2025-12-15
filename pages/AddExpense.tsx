import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Category, CATEGORY_ICONS, Expense, Currency, CURRENCY_SYMBOLS } from '../types';
import { Icon } from '../components/Icon';
import { ChevronLeft, Check } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface AddExpenseProps {
  onSave: (expense: Expense) => void;
  currency: Currency;
}

export const AddExpense: React.FC<AddExpenseProps> = ({ onSave, currency }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingExpense = location.state?.expense as Expense | undefined;

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.Food);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    if (existingExpense) {
        setAmount(existingExpense.amount.toString());
        setCategory(existingExpense.category);
        setNote(existingExpense.note);
        setDate(new Date(existingExpense.date).toISOString().slice(0, 16));
    }
  }, [existingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    const expense: Expense = {
      id: existingExpense ? existingExpense.id : generateId(),
      amount: numAmount,
      category,
      note,
      date: new Date(date).toISOString(),
    };

    onSave(expense);
    navigate(-1);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-primary-500 text-white p-6 pb-24 rounded-b-[2.5rem] shadow-lg relative z-0">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold ml-4">{existingExpense ? 'Edit Expense' : 'Add Expense'}</h1>
        </div>
        <div className="text-center mb-2">
            <span className="text-primary-100 text-sm font-medium">Amount ({currency})</span>
        </div>
        <div className="flex justify-center items-center">
             <span className="text-4xl font-bold text-primary-100 mr-1">{CURRENCY_SYMBOLS[currency]}</span>
            <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-5xl font-bold text-white placeholder-primary-200/50 text-center w-full focus:outline-none"
                autoFocus={!existingExpense}
                step="0.01"
            />
        </div>
      </div>

      {/* Form Card */}
      <div className="flex-1 px-4 -mt-12 relative z-10 pb-4">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 space-y-6">
            
            {/* Category Grid */}
            <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Category</label>
                <div className="grid grid-cols-3 gap-3">
                    {Object.values(Category).map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                                category === cat 
                                ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:border-primary-400 dark:text-primary-300' 
                                : 'bg-white dark:bg-gray-700 border-gray-100 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                        >
                            <div className={`mb-2 p-2 rounded-full ${category === cat ? 'bg-primary-100 dark:bg-primary-800' : 'bg-gray-100 dark:bg-gray-600'}`}>
                                <Icon name={CATEGORY_ICONS[cat]} size={20} />
                            </div>
                            <span className="text-xs font-medium">{cat}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Note */}
            <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Note</label>
                <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What was this for?"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                />
            </div>

            {/* Date */}
            <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Date & Time</label>
                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary-500 dark:text-white dark:[color-scheme:dark]"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/30 flex items-center justify-center space-x-2 transition-transform active:scale-95"
            >
                <Check size={20} />
                <span>{existingExpense ? 'Update Expense' : 'Save Expense'}</span>
            </button>
        </form>
      </div>
    </div>
  );
};
