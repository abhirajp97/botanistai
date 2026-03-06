import React, { useState } from 'react';
import { Settings, X, Eye, EyeOff } from 'lucide-react';

export type Provider = 'groq' | 'google' | 'anthropic' | 'openai';

interface ProviderOption {
  value: Provider;
  label: string;
  free: boolean;
}

const PROVIDERS: ProviderOption[] = [
  { value: 'groq',      label: 'Llama 4 Scout via Groq', free: true  },
  { value: 'google',    label: 'Gemini 2.5 Flash (Google)',     free: false },
  { value: 'anthropic', label: 'Claude (Anthropic)',            free: false },
  { value: 'openai',    label: 'GPT-4o (OpenAI)',               free: false },
];

interface ModelSelectorProps {
  provider: Provider;
  apiKey: string;
  onProviderChange: (provider: Provider) => void;
  onApiKeyChange: (key: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  provider,
  apiKey,
  onProviderChange,
  onApiKeyChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const selectedProvider = PROVIDERS.find((p) => p.value === provider) ?? PROVIDERS[0];
  const needsKey = !selectedProvider.free;

  return (
    <>
      {/* Gear icon trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
        title="Model settings"
        aria-label="Open model settings"
      >
        <Settings className="w-5 h-5" />
        {needsKey && !apiKey && (
          <span
            className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full"
            title="API key required"
          />
        )}
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">Model Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Provider select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                AI Provider
              </label>
              <select
                value={provider}
                onChange={(e) => {
                  onProviderChange(e.target.value as Provider);
                  onApiKeyChange(''); // clear key when switching providers
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                {PROVIDERS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}{p.free ? ' — Free' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Free tier notice */}
            {selectedProvider.free && (
              <p className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-4">
                ✅ No API key needed — powered by open-source Llama 4 via Groq's free tier.
              </p>
            )}

            {/* API key input for non-free providers */}
            {needsKey && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your {selectedProvider.label.split(' ')[0]} API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => onApiKeyChange(e.target.value)}
                    placeholder="Paste your API key..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  Your key is only sent to the server for this request — never stored.
                </p>
              </div>
            )}

            {/* Done */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModelSelector;
