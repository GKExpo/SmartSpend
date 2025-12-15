import React from 'react';
import { format } from 'date-fns';
import { Trash2, Pencil } from 'lucide-react';
import { Expense, CATEGORY_ICONS, CATEGORY_COLORS, Currency, CURRENCY_SYMBOLS } from '../types';
import { Icon } from './Icon';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  currency: Currency;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete, onEdit, currency }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
       <div className="flex items-center p-4">
        {/* Icon */}
        <div className={`p-3 rounded-full ${CATEGORY_COLORS[expense.category] || 'bg-gray-100 text-gray-500'}`}>
          <Icon name={CATEGORY_ICONS[expense.category] || 'CircleDollarSign'} size={20} />
        </div>

        {/* Details */}
        <div className="ml-4 flex-1 mr-2">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{expense.category}</h3>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-50">
              {CURRENCY_SYMBOLS[currency]} {expense.amount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-end mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{expense.note || 'No notes'}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              {format(new Date(expense.date), 'MMM d, h:mm a')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
           <button 
              onClick={() => onEdit(expense)}
              className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              aria-label="Edit"
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={() => onDelete(expense.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              aria-label="Delete"
            >
              <Trash2 size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};
