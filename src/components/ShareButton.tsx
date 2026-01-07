'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    const shareData = {
      title: title,
      text: text || `Check out ${title} on Can I Watch?`,
      url: url || (typeof window !== 'undefined' ? window.location.href : ''),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        
        console.log('Share dialog closed or dismissed');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center w-full h-full text-white transition-colors"
      aria-label="Share"
    >
      {isCopied ? (
        <Check className="w-5 h-5 text-green-400" />
      ) : (
        <Share2 className="w-5 h-5" />
      )}
    </button>
  );
}