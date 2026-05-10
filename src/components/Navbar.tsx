import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { SOCIALS } from '../constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [quote, setQuote] = useState<{ text: string, author: string } | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      fetch('/api/quote')
        .then(res => res.json())
        .then(setQuote)
        .catch(err => console.error('Quote fetch failed', err));
    }
  }, [isOpen]);

  const menuItems = [
    { name: 'Home', href: '/', id: '01', sub: 'The Beginning' },
    { name: 'Theme', href: '/theme', id: '02', sub: 'Borrowed Time' },
    { name: 'Speakers', href: '/speakers', id: '03', sub: 'Global Voices' },
    { name: 'About TED', href: '/about', id: '04', sub: 'Our Philosophy' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-6 md:px-16 py-8 flex justify-between items-center pointer-events-none">
      <Link to="/" className="pointer-events-auto">
        <Logo variant="tedx" className="scale-75 md:scale-100 origin-left" />
      </Link>

      <div className="flex items-center gap-10 pointer-events-auto">
        {/* School Logo */}
        <div className="hidden md:block">
          <Logo variant="school" className="scale-90" />
        </div>

        {/* Navbar Pill - Desktop */}
        <div className="hidden md:flex items-center bg-white/40 backdrop-blur-xl rounded-full p-1 border border-brand-primary/5 shadow-[0_8px_32px_rgba(0,43,91,0.05)]">
          {[
            { name: 'Home', href: '/' },
            { name: 'Theme', href: '/theme' },
            { name: 'Speakers', href: '/speakers' },
            { name: 'About', href: '/about' },
          ].map((item) => (
            <Link 
              key={item.href}
              to={item.href}
              className={`px-8 py-2.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-[0.25em] transition-all duration-500 relative ${
                location.pathname === item.href ? 'text-white' : 'text-brand-primary/60 hover:text-brand-primary'
              }`}
            >
              {location.pathname === item.href && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute inset-0 bg-brand-primary rounded-full z-[-1]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {item.name}
            </Link>
          ))}
        </div>

        {/* Registration - Minimal Pill */}
        <div className="hidden lg:block">
          <Link to="/about#contact">
            <button className="brutalist-button px-10 py-3 text-[10px] tracking-[0.4em] font-sans !bg-brand-primary !text-white border-transparent hover:!bg-brand-secondary transition-colors">
              REGISTER NOW
            </button>
          </Link>
        </div>

        {/* Menu Toggle - Enhanced for visibility */}
        <button 
          className="group flex items-center gap-5 bg-brand-primary/5 hover:bg-brand-primary/10 backdrop-blur-md border border-brand-primary/10 rounded-full pl-6 pr-4 py-2 transition-all pointer-events-auto"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-typewriter text-[9px] uppercase tracking-[0.3em] text-brand-primary/70 group-hover:text-brand-secondary transition-colors">
            Menu
          </span>
          <div className="flex flex-col items-end gap-1.5 transition-all">
            <span className="h-[1px] bg-brand-primary transition-all duration-500 w-6 group-hover:w-8 group-hover:bg-brand-secondary" />
            <span className="h-[1px] bg-brand-primary transition-all duration-500 w-8 group-hover:w-4 group-hover:bg-brand-secondary" />
          </div>
        </button>
      </div>

      {/* Menu Overlay - Full Screen Liquid */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-brand-primary z-[150] flex flex-col pointer-events-auto border-b border-white/5 shadow-2xl text-white"
          >
            {/* Liquid Background Decoration */}
            <div className="absolute inset-0 liquid-bg opacity-10 pointer-events-none" />

            <div className="flex justify-between items-center px-6 md:px-16 py-10 relative z-10">
              <span className="font-typewriter text-[10px] tracking-[1em] text-white/20 uppercase">Navigation / 2026</span>
              <button 
                onClick={() => setIsOpen(false)} 
                className="group flex items-center gap-4 text-white/40 hover:text-white transition-colors"
              >
                <span className="font-typewriter text-[10px] tracking-[0.5em] uppercase">Close</span>
                <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            <div className="flex-grow flex flex-col justify-center px-6 md:px-16 relative z-10">
              {menuItems.map((item, i) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group relative flex items-baseline gap-12 py-8 border-b border-white/5 last:border-none overflow-hidden"
                >
                  <span className="font-typewriter text-xs text-brand-secondary/30 group-hover:text-brand-secondary transition-colors">
                    {item.id}
                  </span>
                  <div className="flex flex-col">
                    <motion.span 
                      initial={{ y: 100, rotate: 5 }}
                      animate={{ y: 0, rotate: 0 }}
                      transition={{ delay: 0.3 + (i * 0.08), duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className={`text-5xl md:text-8xl font-kinetic font-black tracking-tighter uppercase leading-[0.8] transition-all duration-700 ${
                        location.pathname === item.href ? 'text-brand-secondary' : 'text-white group-hover:italic group-hover:translate-x-8'
                      }`}
                    >
                      {item.name}
                    </motion.span>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + (i * 0.1) }}
                      className="font-typewriter text-[9px] uppercase tracking-[1em] text-white/20 group-hover:text-white/60 transition-all pl-2 md:pl-4 mt-4"
                    >
                      {item.sub}
                    </motion.span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="px-6 md:px-16 py-16 flex flex-col md:flex-row justify-between items-end gap-12 relative z-10">
              <div className="max-w-xl">
                {quote ? (
                  <p className="font-editorial text-2xl md:text-3xl text-white/40 leading-tight italic">
                    "{quote.text}" <span className="text-brand-secondary block text-xs font-typewriter not-italic mt-2">— {quote.author}</span>
                  </p>
                ) : (
                  <p className="font-editorial text-2xl md:text-4xl text-white/40 leading-tight italic">
                    "The clock was <span className="text-white">already running</span> when you opened your eyes."
                  </p>
                )}
              </div>
              <div className="flex gap-16 font-typewriter text-[10px] tracking-[0.5em] uppercase">
                <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-secondary transition-colors">Instagram</a>
                <a href={`mailto:${SOCIALS.email}`} className="hover:text-brand-secondary transition-colors">Inquiries</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
