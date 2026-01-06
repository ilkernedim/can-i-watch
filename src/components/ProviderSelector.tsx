'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Filter, X, Check, Tv } from 'lucide-react';

// Türkiye ve Global için en popüler servislerin güncel listesi
const PROVIDERS = [
  { id: 8, name: "Netflix", logo: "/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg" },
  { id: 337, name: "Disney+", logo: "/7rwNKZSxdBvQN1F5m7uJ7jL028.jpg" },
  { id: 119, name: "Prime Video", logo: "/emthp39XA2YScoU8t5t7TB3eczT.jpg" },
  { id: 350, name: "Apple TV+", logo: "/2E03IAfX1VkLUOIFOSTcNatvWKP.jpg" },
  { id: 349, name: "BluTV", logo: "/mX3W55sY86V8M8T1H9KxZ8.jpg" }, // BluTV Logosu
  { id: 11, name: "MUBI", logo: "/bMZc2d2B6kX1A9G15X1.jpg" },
  { id: 188, name: "YouTube Premium", logo: "/6IPjCMQ9l5dM0P06M17f96g7gGq.jpg" },
  { id: 3, name: "Google Play", logo: "/tbEdFqdNxjOwCphaBYjj667bqMT.jpg" },
  { id: 283, name: "Crunchyroll", logo: "/mXeC4TrcgdU6ltE9bCBCEORwSQR.jpg" },
  { id: 1899, name: "Max", logo: "/6Q3ZYyw9k7QEosbxGblcaPhE66L.jpg" },
  { id: 414, name: "TOD", logo: "/7Mw8C9yE4bB2j1g5E6W3.jpg" }, // Temsili TOD/beIN Connect ID
  { id: 1234, name: "Exxen", logo: "/8.jpg" } // Exxen için placeholder veya varsa ID
];

export default function ProviderSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('my_providers') || '[]');
      setSelectedProviders(saved);
    }
  }, []);

  const toggleProvider = (id: number) => {
    setSelectedProviders(prev => {
      const newSelection = prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id];
      return newSelection;
    });
  };

  const handleSave = () => {
    localStorage.setItem('my_providers', JSON.stringify(selectedProviders));
    setIsOpen(false);
    window.location.reload(); 
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors group"
        title="My Services"
      >
        <div className="relative">
            <Tv className="w-6 h-6" />
            {selectedProviders.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white ring-2 ring-[#050505]">
                    {selectedProviders.length}
                </span>
            )}
        </div>
      </button>

      {isOpen && (
        // z-index artırıldı ve fixed pozisyonu garantilendi
        <div className="fixed inset-0 top-0 left-0 z-[9999] h-full w-full flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200 p-4">
          
          <div className="relative w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#161616]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Select Your Services
              </h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <p className="text-sm text-gray-400 mb-6">
                    Select the streaming services you possess. We will prioritize these platforms in your search results.
                </p>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {PROVIDERS.map((provider) => {
                        const isSelected = selectedProviders.includes(provider.id);
                        
                        // Exxen gibi resmi logosu TMDB'de zor bulunanlar için fallback
                        const logoSrc = provider.name === "Exxen" 
                            ? "https://upload.wikimedia.org/wikipedia/commons/c/c9/Exxen_logo.svg" 
                            : provider.name === "TOD"
                            ? "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/TOD_logo.svg/2560px-TOD_logo.svg.png"
                            : `https://image.tmdb.org/t/p/original${provider.logo}`;

                        return (
                            <button
                                key={provider.id}
                                onClick={() => toggleProvider(provider.id)}
                                className={`relative group flex flex-col items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:border-white/20 ${
                                    isSelected 
                                    ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                                    : 'bg-[#1a1a1a] border-white/5'
                                }`}
                            >
                                <div className={`relative w-14 h-14 rounded-xl overflow-hidden shadow-lg ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#121212]' : ''}`}>
                                    <div className="absolute inset-0 bg-white/5" /> {/* Logo arkası hafif dolgu */}
                                    <Image 
                                        src={logoSrc}
                                        alt={provider.name}
                                        fill
                                        className="object-cover"
                                        unoptimized={provider.name === "Exxen" || provider.name === "TOD"} // Harici linkler için optimize'i kapat
                                    />
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-primary/60 flex items-center justify-center backdrop-blur-[1px]">
                                            <Check className="w-8 h-8 text-white drop-shadow-md" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[11px] font-bold text-center w-full truncate px-1 ${isSelected ? 'text-primary' : 'text-gray-400'}`}>
                                    {provider.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/5 bg-[#161616] flex justify-end gap-3">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-primary hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105"
                >
                    Save Changes
                </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}