import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'tedx' | 'school';
}

export default function Logo({ className = '', variant = 'tedx' }: LogoProps) {
  if (variant === 'tedx') {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="flex items-baseline leading-none">
          <span className="text-red-600 font-title font-black text-4xl md:text-5xl tracking-tighter">TED</span>
          <span className="text-red-600 font-title font-black text-2xl md:text-3xl tracking-tighter">x</span>
        </div>
        <div className="flex flex-col -mt-1">
          <span className="font-sans font-bold text-[12px] md:text-[14px] uppercase tracking-widest text-brand-primary">AlMuntazir Schools</span>
          <span className="font-sans font-semibold text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-brand-primary italic -mt-0.5">Youth</span>
          <span className="font-typewriter text-[7px] uppercase tracking-[0.2em] text-brand-primary/40 mt-1.5">independently organized event</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-title text-xl font-bold">
        AM
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-bold text-[10px] leading-tight text-brand-primary uppercase">AlMuntazir Islamic</span>
        <span className="font-sans text-[8px] leading-tight text-brand-primary/60 uppercase">International Schools</span>
      </div>
    </div>
  );
}
