import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEGMENTS } from '../constants';
import { Search, Plus, X } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import MaskReveal from '../components/MaskReveal';
import InteractiveBackground from '../components/InteractiveBackground';
import FloatingBackground from '../components/FloatingBackground';
import { MechanicalClock, ModernSandglass, DigitalNetwork } from '../components/ModernAnimation';

const transition = { duration: 1.2, ease: [0.76, 0, 0.24, 1] as const };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const speakerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.3, 
      ease: "easeOut" 
    }
  }
};

interface Speaker {
  id: string;
  name: string;
  topic: string;
  segmentId: string;
  bio?: string;
  image?: string;
  role?: string;
}

export default function Speakers() {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [speakersData, setSpeakersData] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const hapticTick = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  useEffect(() => {
    fetch('/api/speakers')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setSpeakersData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.warn('Error fetching speakers, using fallback data:', err);
        // Fallback to constants if API fails
        import('../constants').then(m => {
          setSpeakersData(m.SPEAKERS);
          setIsLoading(false);
        });
      });
  }, []);

  const filteredSpeakers = speakersData.filter(speaker => {
    const matchesSegment = selectedSegment === 'all' || speaker.segmentId === selectedSegment;
    const matchesSearch = speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         speaker.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSegment && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-32 min-h-screen relative overflow-hidden"
    >
      <InteractiveBackground />
      <FloatingBackground />
      
      <div className="px-6 md:px-16 max-w-screen-2xl mx-auto relative z-10">
        <header className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={transition}
            className="max-w-4xl"
          >
            <div className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase mb-12">The Guest List</div>
            <h1 className="text-8xl md:text-[12vw] font-title font-black tracking-tighter leading-[0.75] uppercase flex flex-col text-brand-primary">
              <MaskReveal delay={0.2}>The</MaskReveal>
              <MaskReveal delay={0.4} className="italic font-editorial lowercase -ml-6 text-brand-secondary">Assembly.</MaskReveal>
            </h1>
          </motion.div>
          <div className="max-w-xs font-editorial text-2xl text-brand-primary/40 italic leading-tight">
            Meet the people asking: What are you doing with the time you’ve got?
          </div>
        </header>
        
        {/* Dynamic Filter / Search */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20 border-y border-brand-outline py-12 px-8 -mx-8 bg-white/5 backdrop-blur-sm rounded-xl relative z-20">
          <div className="flex flex-wrap gap-8">
            {['all', ...SEGMENTS.map(s => s.id)].map(id => (
              <button
                key={id}
                onClick={() => {
                  setSelectedSegment(id);
                  hapticTick();
                }}
                className={`py-3 font-typewriter text-[11px] uppercase tracking-[0.4em] transition-all relative ${
                  selectedSegment === id ? 'text-brand-secondary' : 'text-brand-primary/40 hover:text-brand-primary'
                }`}
              >
                {id === 'all' ? 'Everything' : SEGMENTS.find(s => s.id === id)?.title}
                {selectedSegment === id && (
                  <motion.div layoutId="filter-underline" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-brand-secondary" />
                )}
              </button>
            ))}
          </div>

          <div className="relative flex-grow max-w-md border-l border-brand-outline pl-12 hidden lg:block">
            <Search className="absolute left-16 top-1/2 -translate-y-1/2 text-brand-primary/20" size={16} />
            <input 
              type="text"
              placeholder="Find a talk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none py-4 px-12 font-sans text-brand-primary focus:outline-none placeholder:text-brand-primary/20 placeholder:font-typewriter placeholder:text-[10px] placeholder:uppercase placeholder:tracking-[0.4em]"
            />
          </div>
        </div>

        {/* Typographic List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center font-typewriter text-brand-primary/20 animate-pulse tracking-[0.5em] uppercase">
              Retrieving the Assembly...
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <div className="space-y-4">
                {filteredSpeakers.map((speaker, i) => (
                <div
                  key={speaker.id}
                  className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 py-16 border-b border-brand-outline px-6 -mx-6 rounded-[2rem] items-center overflow-hidden hover:bg-white/5 hover:backdrop-blur-md transition-all duration-500"
                >
                <div className="md:col-span-1 font-typewriter text-[11px] text-brand-primary/20 relative z-10 hidden md:block">
                  0{i + 1}
                </div>
                <div className="md:col-span-10 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-12">
                    <div className="flex items-center justify-between md:block">
                      <h3 className="text-3xl md:text-6xl font-title font-black tracking-tighter text-brand-primary uppercase">
                        {speaker.name}
                      </h3>
                      <span className="md:hidden font-typewriter text-[10px] text-brand-primary/20">0{i + 1}</span>
                    </div>
                    <p className="font-editorial text-xl md:text-3xl text-brand-primary/40 italic leading-tight pr-4">
                      "{speaker.topic}"
                    </p>
                  </div>
                </div>
                <div className="md:col-span-1 flex justify-start md:justify-end relative z-10 mt-4 md:mt-0">
                  <Magnetic strength={0.4}>
                    <button 
                      onClick={() => {
                        setSelectedSpeaker(speaker);
                        hapticTick();
                      }}
                      className="w-16 h-16 rounded-full border-2 border-brand-outline flex items-center justify-center text-brand-primary hover:bg-brand-secondary hover:border-brand-secondary hover:text-white transition-colors"
                    >
                      <Plus size={24} />
                    </button>
                  </Magnetic>
                </div>
              </div>
            ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Polish Modal Section - Apple Glass Design */}
      <AnimatePresence>
        {selectedSpeaker && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpeaker(null)}
              className="absolute inset-0 bg-brand-primary/20 backdrop-blur-md cursor-pointer"
            />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                transition={{ type: "spring", damping: 25, stiffness: 200, mass: 1 }}
                className="relative w-full max-w-3xl bg-white/40 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.1)] border border-white/40 flex flex-col h-auto max-h-[85vh] pointer-events-auto overflow-hidden"
              >
              <button 
                onClick={() => setSelectedSpeaker(null)}
                className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/40 backdrop-blur-md hover:bg-white/60 flex items-center justify-center text-brand-primary z-50 transition-all active:scale-90 border border-white/20 shadow-sm"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>

              {/* Content Area */}
              <div 
                className="flex-1 p-6 md:p-16 pt-16 md:pt-20 overflow-y-auto custom-scrollbar"
                data-lenis-prevent
              >
                <div className="mb-10 md:mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="font-typewriter text-[10px] text-brand-secondary uppercase tracking-[0.5em] mb-4 block opacity-60">
                      {SEGMENTS.find(s => s.id === selectedSpeaker.segmentId)?.title || 'Speaker'} / Journal Entry
                    </span>
                    <h2 className="font-title text-5xl md:text-6xl font-black uppercase text-brand-primary leading-[0.9] tracking-tighter mb-4">
                      {selectedSpeaker.name}
                    </h2>
                  </motion.div>
                </div>
                
                <div className="space-y-10">
                  <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-typewriter text-[9px] uppercase tracking-widest text-brand-primary/40 border-b border-brand-outline/20 pb-4 mb-6">Topic Title</h4>
                    <p className="font-editorial text-3xl italic text-brand-primary leading-tight">"{selectedSpeaker.topic}"</p>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative group/bio"
                  >
                    <h4 className="font-typewriter text-[9px] uppercase tracking-widest text-brand-primary/40 border-b border-brand-outline/20 pb-4 mb-6">The Narrative</h4>
                    <div className="p-8 rounded-3xl bg-white/20 border border-white/20 backdrop-blur-md shadow-inner">
                      <div className="font-sans text-lg text-brand-primary/90 leading-relaxed max-w-2xl space-y-4">
                        <p className="first-letter:text-5xl first-letter:font-editorial first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-brand-secondary">
                          {selectedSpeaker.bio || "This speaker will be sharing transformative insights on the intersection of humanity, technology, and the ticking clock of our shared existence, challenging us to rethink how we choose to spend the time we possess."}
                        </p>
                      </div>
                    </div>
                  </motion.section>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="pt-4 flex justify-end"
                  >
                    <button 
                      onClick={() => setSelectedSpeaker(null)}
                      className="px-10 py-5 bg-white/40 backdrop-blur-xl border border-white/40 text-brand-primary rounded-full font-typewriter text-[10px] uppercase tracking-[0.2em] hover:bg-brand-primary hover:text-white transition-all active:scale-95 shadow-lg shadow-black/5"
                    >
                      Close Journal
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
