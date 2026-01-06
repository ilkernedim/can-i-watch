'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Filter, X, Check, Tv } from 'lucide-react';

const PROVIDERS = [
  { id: 8, name: "Netflix", logo: "/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg" },
  { id: 337, name: "Disney Plus", logo: "/7rwNKZSxdBvQN1F5m7uJ7jL028.jpg" },
  { id: 119, name: "Prime Video", logo: "/emthp39XA2YScoU8t5t7TB3eczT.jpg" },
  { id: 350, name: "Apple TV+", logo: "/2E03IAfX1VkLUOIFOSTcNatvWKP.jpg" },
  { id: 1899, name: "Max", logo: "/6Q3ZYyw9k7QEosbxGblcaPhE66L.jpg" },
  { id: 283, name: "Crunchyroll", logo: "/mXeC4TrcgdU6ltE9bCBCEORwSQR.jpg" }
];

export default function ProviderSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('my_providers') || '[]');
    setSelectedProviders(saved);
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
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white">
                    {selectedProviders.length}
                </span>
            )}
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#161616]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Select Your Services
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
                <p className="text-sm text-gray-400 mb-6">
                    Select the services you subscribe to. We'll prioritize these in your search results.
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                    {PROVIDERS.map((provider) => {
                        const isSelected = selectedProviders.includes(provider.id);
                        return (
                            <button
                                key={provider.id}
                                onClick={() => toggleProvider(provider.id)}
                                className={`relative group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                                    isSelected 
                                    ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                                    : 'bg-[#1a1a1a] border-white/5 hover:border-white/20'
                                }`}
                            >
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-lg">
                                    <Image 
                                        src={`https://image.tmdb.org/t/p/original${provider.logo}`}
                                        alt={provider.name}
                                        fill
                                        className={`object-cover transition-all duration-300 ${isSelected ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}
                                    />
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-primary/40 flex items-center justify-center backdrop-blur-[1px]">
                                            <Check className="w-6 h-6 text-white drop-shadow-md" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                                <span className={`text-xs font-medium truncate w-full text-center ${isSelected ? 'text-primary' : 'text-gray-400'}`}>
                                    {provider.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

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