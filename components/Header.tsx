import React from 'react';
import { Leaf } from 'lucide-react';
import ModelSelector, { Provider } from './ModelSelector';

interface HeaderProps {
  provider: Provider;
  apiKey: string;
  onProviderChange: (provider: Provider) => void;
  onApiKeyChange: (key: string) => void;
}

const Header: React.FC<HeaderProps> = ({ provider, apiKey, onProviderChange, onApiKeyChange }) => {
  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-green-700">
        <div className="bg-green-600 p-2 rounded-lg text-white">
          <Leaf className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">BotanistAI</span>
      </div>
      <nav className="flex items-center gap-3">
        <ModelSelector
          provider={provider}
          apiKey={apiKey}
          onProviderChange={onProviderChange}
          onApiKeyChange={onApiKeyChange}
        />
      </nav>
    </header>
  );
};

export default Header;
