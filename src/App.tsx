import React, { useState } from 'react';
import { ShieldCheck, Map, Image as ImageIcon } from 'lucide-react';
import { Analyzer } from './components/Analyzer';
import { Roadmap } from './components/Roadmap';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'roadmap'>('analyzer');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">AI Authenticator</h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'analyzer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Analisador
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'roadmap'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Map className="w-4 h-4" />
              Guia de Arquitetura
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {activeTab === 'analyzer' ? <Analyzer /> : <Roadmap />}
      </main>
    </div>
  );
}
