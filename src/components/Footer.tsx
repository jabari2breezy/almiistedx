import { ArrowUpRight } from 'lucide-react';
import { SOCIALS } from '../constants';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="px-6 md:px-16 py-24 border-t border-brand-outline relative overflow-hidden bg-white">
      {/* Liquid Hint */}
      <div className="absolute bottom-0 right-0 w-96 h-96 liquid-bg opacity-10 blur-3xl pointer-events-none" />
      
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-start relative z-10">
        <div className="md:col-span-6 space-y-8 text-brand-primary">
          <div className="flex flex-col grayscale brightness-0 opacity-80">
            <Logo variant="tedx" className="scale-75 origin-left" />
          </div>
          <p className="font-editorial text-2xl leading-tight max-w-sm italic">
            "Ideas are the only legacy that survives the <span className="text-brand-secondary font-title not-italic uppercase">borrowed time</span>."
          </p>
          <div className="pt-4 flex flex-col gap-4 opacity-40 grayscale">
            <Logo variant="school" className="scale-90 origin-left" />
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="flex flex-col gap-4 font-title text-xl uppercase tracking-tighter text-brand-primary">
            <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-secondary transition-colors group">
              Instagram <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            <a href={`mailto:${SOCIALS.email}`} className="flex items-center gap-2 hover:text-brand-secondary transition-colors group">
              Get in touch <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>

        <div className="md:col-span-3 space-y-4">
          <p className="font-sans text-[10px] text-brand-primary/40 uppercase tracking-widest leading-relaxed">
            This independent TEDx event is operated under license from TED. <br /><br />
            © 2026 TEDxAlMuntazirSchoolsYouth.
          </p>
        </div>
      </div>
    </footer>
  );
}
