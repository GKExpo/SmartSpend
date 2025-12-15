import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, History, Settings } from 'lucide-react';

export const NavBar: React.FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center w-full h-full space-y-1 ${
      isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
    }`;

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe z-50">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        <NavLink to="/" className={navClass}>
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </NavLink>
        <NavLink to="/add" className="relative -top-5">
           <div className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105">
             <PlusCircle size={32} />
           </div>
        </NavLink>
        <NavLink to="/history" className={navClass}>
          <History size={24} />
          <span className="text-[10px] font-medium">History</span>
        </NavLink>
        <NavLink to="/settings" className={navClass}>
          <Settings size={24} />
          <span className="text-[10px] font-medium">Settings</span>
        </NavLink>
      </div>
    </div>
  );
};