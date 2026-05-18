import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SOCIALS } from '../constants';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="px-6 md:px-16 py-32 border-t border-brand-outline relative overflow-hidden bg-brand-surface/40 backdrop-blur-md">
      <div className="absolute inset-0 liquid-bg opacity-5 -z-10" />
      
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20 relative z-10">
        <div className="flex-1 space-y-12">
          <div className="flex flex-col gap-6">
            <Logo variant="tedx" className="scale-90 md:scale-110 origin-left" />
            <div className="w-16 h-[1px] bg-brand-primary/10" />
            <Logo variant="school" className="scale-100 origin-left opacity-50 hover:opacity-100 transition-opacity" />
          </div>
          <p className="font-editorial text-4xl md:text-5xl leading-tight max-w-lg italic text-brand-primary">
            "Ideas are the <span className="text-brand-secondary font-title not-italic uppercase">legacy</span> that survives the curated time."
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h4 className="font-typewriter text-[10px] uppercase tracking-[0.4em] text-brand-primary/40">Navigation</h4>
            <div className="flex flex-col gap-4 font-title text-xl uppercase tracking-tighter text-brand-primary">
              <Link to="/" className="hover:text-brand-secondary transition-colors">Home</Link>
              <Link to="/theme" className="hover:text-brand-secondary transition-colors">Theme</Link>
              <Link to="/speakers" className="hover:text-brand-secondary transition-colors">Speakers</Link>
              <Link to="/about" className="hover:text-brand-secondary transition-colors">About</Link>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="font-typewriter text-[10px] uppercase tracking-[0.4em] text-brand-primary/40">Connect</h4>
            <div className="flex flex-col gap-4 font-title text-xl uppercase tracking-tighter text-brand-primary">
              <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-brand-secondary transition-colors group">
                Instagram <ArrowUpRight size={16} className="opacity-40 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
              <a href={`mailto:${SOCIALS.email}`} className="flex items-center gap-3 hover:text-brand-secondary transition-colors group">
                Contact <ArrowUpRight size={16} className="opacity-40 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto pt-32 flex flex-col md:flex-row justify-between items-end gap-12 opacity-40">
        <p className="font-sans text-[9px] uppercase tracking-widest leading-relaxed max-w-sm">
          This independent TEDx event is operated under license from TED. <br /><br />
          © 2026 TEDxAlMuntazirSchoolsYouth.
        </p>
        <div className="font-typewriter text-[9px] uppercase tracking-[0.4em]">
          Dar Es Salaam, Tanzania
        </div>
      </div>
    </footer>
  );
}
