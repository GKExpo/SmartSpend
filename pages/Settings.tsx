import React from 'react';
import { Moon, Sun, Download, Trash2, Smartphone, FileText, File as FileIcon, RefreshCw } from 'lucide-react';
import { Expense, CurrencySettings, Currency, CURRENCY_SYMBOLS } from '../types';
import { jsPDF } from "jspdf";
import { fetchRates } from '../services/currency';

interface SettingsProps {
  isDark: boolean;
  toggleTheme: () => void;
  expenses: Expense[];
  onClearAll: () => void;
  currencySettings: CurrencySettings;
  onCurrencyChange: (settings: CurrencySettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  isDark, 
  toggleTheme, 
  expenses, 
  onClearAll,
  currencySettings,
  onCurrencyChange
}) => {
  
  const getTimestamp = () => new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  const exportCSV = () => {
    if (expenses.length === 0) return alert("No expenses to export.");
    const headers = ["ID", "Amount", "Currency", "Category", "Note", "Date"];
    const rows = expenses.map(e => [e.id, e.amount, currencySettings.base, e.category, `"${e.note}"`, e.date]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    downloadFile(encodeURI(csvContent), `smartspend_${getTimestamp()}.csv`);
  };

  const exportText = () => {
    if (expenses.length === 0) return alert("No expenses to export.");
    const textContent = expenses.map(e => 
      `${e.date.slice(0,10)} | ${e.category.padEnd(10)} | ${currencySettings.base} ${e.amount.toFixed(2).padEnd(8)} | ${e.note}`
    ).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    downloadFile(URL.createObjectURL(blob), `smartspend_${getTimestamp()}.txt`);
  };

  const exportPDF = () => {
    if (expenses.length === 0) return alert("No expenses to export.");
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("SmartSpend Expense Report", 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Base Currency: ${currencySettings.base}`, 14, 36);

    let y = 50;
    expenses.forEach((e, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.text(`${e.date.slice(0,10)}`, 14, y);
      doc.text(`${e.category}`, 50, y);
      doc.text(`${currencySettings.base} ${e.amount.toFixed(2)}`, 100, y);
      doc.text(`${e.note}`, 140, y, { maxWidth: 60 });
      y += 10;
    });

    doc.save(`smartspend_${getTimestamp()}.pdf`);
  };

  const downloadFile = (uri: string, name: string) => {
    const link = document.createElement("a");
    link.setAttribute("href", uri);
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearData = () => {
      if(window.confirm("Are you sure you want to delete ALL data? This cannot be undone.")) {
          onClearAll();
      }
  }

  const toggleDisplayCurrency = (curr: Currency) => {
    const current = currencySettings.display;
    const newDisplay = current.includes(curr) 
      ? current.filter(c => c !== curr) 
      : [...current, curr];
    onCurrencyChange({ ...currencySettings, display: newDisplay });
  };

  const refreshRates = async () => {
      await fetchRates(currencySettings.base);
      alert('Exchange rates updated!');
  };

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </header>

      <div className="space-y-6">
        {/* Currency Settings */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-2">Currency</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Base Currency</label>
              <select 
                value={currencySettings.base}
                onChange={(e) => onCurrencyChange({ ...currencySettings, base: e.target.value as Currency })}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
              >
                {Object.values(Currency).map(c => (
                  <option key={c} value={c}>{c} ({CURRENCY_SYMBOLS[c]})</option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-1">Currency for entering and storing expenses.</p>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Conversions</label>
               <div className="flex flex-wrap gap-2">
                 {Object.values(Currency).map(c => (
                   <button
                     key={c}
                     onClick={() => toggleDisplayCurrency(c)}
                     className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                       currencySettings.display.includes(c)
                       ? 'bg-primary-500 text-white border-primary-500' 
                       : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-500 dark:text-gray-400'
                     }`}
                   >
                     {c}
                   </button>
                 ))}
               </div>
            </div>

            <button onClick={refreshRates} className="text-primary-600 text-xs font-medium flex items-center">
                <RefreshCw size={12} className="mr-1" /> Refresh Exchange Rates
            </button>
          </div>
        </section>

        {/* Appearance */}
        <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-2">Appearance</h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg mr-3">
                            {isDark ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
                    </div>
                    <div className={`w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative transition-colors ${isDark ? '!bg-primary-500' : ''}`}>
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform ${isDark ? 'translate-x-5' : ''}`}></div>
                    </div>
                </button>
            </div>
        </section>

        {/* Data */}
        <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-2">Export Data</h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                <button onClick={exportCSV} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg mr-3">
                            <FileText size={20} />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">Export as CSV</span>
                    </div>
                </button>
                <button onClick={exportPDF} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg mr-3">
                            <FileIcon size={20} />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">Export as PDF</span>
                    </div>
                </button>
                <button onClick={exportText} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <div className="flex items-center">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg mr-3">
                            <Download size={20} />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">Export as Text</span>
                    </div>
                </button>
            </div>
        </section>

        {/* Danger Zone */}
        <section>
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <button onClick={handleClearData} className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition group">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg mr-3 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition">
                            <Trash2 size={20} />
                        </div>
                        <span className="font-medium text-red-600 dark:text-red-400">Clear All Data</span>
                    </div>
                </button>
            </div>
        </section>

         <div className="pt-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-2 text-gray-400">
                <Smartphone size={24} />
            </div>
            <p className="text-xs text-gray-400">SmartSpend v1.2.0</p>
         </div>
      </div>
    </div>
  );
};
