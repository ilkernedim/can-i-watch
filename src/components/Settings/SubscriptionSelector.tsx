'use client';

import { SUPPORTED_PROVIDERS } from '@/types';
import { cn, getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { Check } from 'lucide-react';

interface Props {
  selectedIds: number[];
  onToggle: (id: number) => void;
}

export default function SubscriptionSelector({ selectedIds, onToggle }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {SUPPORTED_PROVIDERS.map((provider) => {
        const isSelected = selectedIds.includes(provider.provider_id);
        return (
          <button
            key={provider.provider_id}
            onClick={() => onToggle(provider.provider_id)}
            className={cn(
              "relative group flex items-center justify-center rounded-2xl transition-all duration-300 p-1",
              isSelected 
                ? "bg-gradient-to-br from-green-400 to-blue-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] scale-110" 
                : "bg-gray-800/50 hover:bg-gray-700/80 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            )}
            title={provider.provider_name}
          >
            {/* Logonun kendisini tutan kare kutu */}
            <span className={cn(
                "relative block w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden",
                "border-2 border-white/10 group-hover:border-white/30 transition-colors", // İnce çerçeve ve hover efekti
                isSelected ? "border-transparent" : "grayscale group-hover:grayscale-0" // Seçili değilse gri, seçilince renkli
            )}>
               <Image 
                  src={getImageUrl(provider.logo_path)}
                  alt={provider.provider_name}
                  fill
                  // 'p-1.5' padding'ini kaldırdık, artık daha dolgun görünecekler.
                  className="object-contain" 
                  sizes="64px"
               />
            </span>
            {isSelected && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-[#060606] shadow-sm z-10">
                <Check className="w-3.5 h-3.5 stroke-[4]" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
