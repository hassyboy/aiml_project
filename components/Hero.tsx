import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToMap = () => {
    const mapSection = document.getElementById('map-section');
    mapSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1582555694242-6e2e50519f7f?q=80&w=2000&auto=format&fit=crop")' }} // Hampi-like stone texture
      >
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/40 to-stone-900/80"></div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-stone-50">
        <div className="animate-fade-in-up space-y-6">
          <h2 className="text-lg font-medium tracking-[0.2em] text-amber-400 uppercase">Discover the Royal State</h2>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg">
            Heritage<span className="text-amber-500">Guide</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl font-light text-stone-200">
            An AI-driven journey through Karnataka’s timeless monuments, misty hills, and sacred temples.
          </p>
          
          <div className="pt-8">
            <button 
              onClick={scrollToMap}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-rose-900 px-8 py-4 font-medium text-white shadow-xl transition-all hover:bg-rose-800 hover:scale-105"
            >
              <span>Explore Karnataka</span>
              <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-stone-400">
        <ChevronDown size={32} />
      </div>
    </div>
  );
};

export default Hero;
