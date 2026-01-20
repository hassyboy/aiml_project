import React from 'react';
import { Cpu, Map as MapIcon, Database } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-stone-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-serif font-bold text-rose-900">HeritageGuide</h3>
            <p className="mt-2 text-sm text-stone-500 max-w-xs">
              Rediscovering Karnataka's glory through the lens of Artificial Intelligence.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-2 text-stone-400">
              <Cpu size={20} />
              <span className="text-xs">GenAI Powered</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-stone-400">
              <MapIcon size={20} />
              <span className="text-xs">Interactive Maps</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-stone-400">
              <Database size={20} />
              <span className="text-xs">Real-time Data</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-stone-400">
          &copy; {new Date().getFullYear()} HeritageGuide Project. Built for educational purposes.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
