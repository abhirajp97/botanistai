import React from 'react';
import { Leaf } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-green-700">
        <div className="bg-green-600 p-2 rounded-lg text-white">
            <Leaf className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">BotanistAI</span>
      </div>
      <nav>
        <a href="#" className="text-sm font-medium text-green-800 hover:text-green-600 transition">About</a>
      </nav>
    </header>
  );
};

export default Header;