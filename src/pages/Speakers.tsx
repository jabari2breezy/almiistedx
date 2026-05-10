import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEGMENTS } from '../constants';
import { Search, Plus, X, ArrowUpRight } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import MaskReveal from '../components/MaskReveal';
import PerspectiveCard from '../components/PerspectiveCard';
import { MechanicalClock, ModernSandglass, DigitalNetwork } from '../components/ModernAnimation';

const transition = { duration: 1.2, ease: [0.76, 0, 0.24, 1] };

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
  hidden: { opacity: 0, x: -10, y: 40 },
  visible: { 
    opacity: 1, 
    x: 0, 
    y: 0,
    transition: { 
      duration: 1.4, 
      ease: [0.22, 1, 0.36, 1] 
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
      .then(res => res.json())
      .then(data => {
        setSpeakersData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching speakers:', err);
        setIsLoading(false);
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
      className="pt-40 pb-32"
    >
      <div className="px-6 md:px-16 max-w-screen-2xl mx-auto">
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
        
        {/* Featured 3D Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {speakersData.slice(0, 3).map((speaker, i) => (
            <motion.div 
              key={`featured-${speaker.id}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <PerspectiveCard className="group cursor-none">
                <div 
                  className="aspect-[3/4] rounded-[2rem] bg-brand-primary overflow-hidden relative border border-white/10"
                  onClick={() => setSelectedSpeaker(speaker)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-transparent to-transparent z-10 opacity-60" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                    <span className="font-typewriter text-[9px] text-brand-secondary tracking-[0.4em] uppercase mb-2">Featured / 0{i+1}</span>
                    <h3 className="text-3xl font-title font-black uppercase text-white leading-none mb-1">{speaker.name}</h3>
                    <p className="font-editorial text-white/50 italic text-sm truncate">{speaker.topic}</p>
                    
                    <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                  
                  {/* Visual Background Decoration */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                    {speaker.segmentId === 'past' && <MechanicalClock className="w-full h-full text-white p-12" />}
                    {speaker.segmentId === 'present' && <ModernSandglass className="w-full h-full text-white p-12" />}
                    {speaker.segmentId === 'future' && <DigitalNetwork className="w-full h-full text-white p-12" />}
                  </div>
                </div>
              </PerspectiveCard>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Filter / Search */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20 border-y border-brand-outline py-12">
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
              <AnimatePresence mode="popLayout">
                {filteredSpeakers.map((speaker, i) => (
                <motion.div
                  key={speaker.id}
                  layout
                  variants={speakerVariants}
                  exit={{ opacity: 0, y: -20 }}
                  className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 py-16 border-b border-brand-outline hover:bg-brand-surface transition-colors px-6 -mx-6 rounded-[2rem] items-center overflow-hidden"
                >
                  {/* Subtle Background Animation on Hover */}
                  <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                    {speaker.segmentId === 'past' && <MechanicalClock className="w-full h-full scale-150 translate-x-1/2" />}
                    {speaker.segmentId === 'present' && <ModernSandglass className="w-full h-full scale-150 -translate-x-1/4" />}
                    {speaker.segmentId === 'future' && <DigitalNetwork className="w-full h-full scale-110" />}
                  </div>

                <div className="md:col-span-1 font-typewriter text-[11px] text-brand-primary/20 group-hover:text-brand-secondary transition-colors relative z-10">
                  0{i + 1}
                </div>
                <div className="md:col-span-5 relative z-10">
                  <h3 className="text-4xl md:text-6xl font-title font-black tracking-tighter text-brand-primary group-hover:pl-4 transition-all duration-500 uppercase">
                    {speaker.name}
                  </h3>
                </div>
                <div className="md:col-span-5 pb-4 md:pb-0 relative z-10">
                  <p className="font-editorial text-2xl md:text-3xl text-brand-primary/40 italic leading-tight group-hover:text-brand-primary transition-colors">
                    "{speaker.topic}"
                  </p>
                </div>
                <div className="md:col-span-1 flex justify-end relative z-10">
                  <Magnetic strength={0.4}>
                    <button 
                      onClick={() => {
                        setSelectedSpeaker(speaker);
                        hapticTick();
                      }}
                      className="w-16 h-16 rounded-full border-2 border-brand-outline flex items-center justify-center group-hover:bg-brand-secondary group-hover:border-brand-secondary transition-all text-brand-primary group-hover:text-white"
                    >
                      <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                  </Magnetic>
                </div>
              </motion.div>
            ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Polish Modal Section - Airbnb Style */}
      <AnimatePresence>
        {selectedSpeaker && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpeaker(null)}
              className="fixed inset-0 bg-brand-primary/95 backdrop-blur-xl z-[500] cursor-pointer"
            />
            <motion.div
              layoutId={`speaker-${selectedSpeaker.id}`}
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 md:inset-4 lg:inset-[10%] bg-white rounded-t-[2.5rem] md:rounded-[2rem] z-[501] overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto h-[90vh] md:h-auto"
            >
              <button 
                onClick={() => setSelectedSpeaker(null)}
                className="absolute top-6 right-8 md:right-6 w-12 h-12 rounded-full bg-brand-primary/5 hover:bg-brand-primary/10 flex items-center justify-center text-brand-primary z-10 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-1/3 h-full bg-brand-surface relative flex items-center justify-center p-12 overflow-hidden">
                {selectedSpeaker.segmentId === 'past' && <MechanicalClock className="w-full h-full text-brand-primary" />}
                {selectedSpeaker.segmentId === 'present' && <ModernSandglass className="w-full h-full text-brand-secondary" />}
                {selectedSpeaker.segmentId === 'future' && <DigitalNetwork className="w-full h-full text-brand-primary" />}
                
                <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-transparent opacity-80" />
              </div>

              <div className="w-full md:w-2/3 p-10 md:p-16 pt-16 overflow-y-auto custom-scrollbar bg-white">
                <div className="w-12 h-1.5 bg-brand-outline/40 rounded-full mx-auto mb-8 md:hidden" />
                <span className="font-typewriter text-xs text-brand-secondary uppercase tracking-[0.4em] mb-4 block">
                  {SEGMENTS.find(s => s.id === selectedSpeaker.segmentId)?.title || 'Speaker'}
                </span>
                <h2 className="font-kinetic text-4xl md:text-6xl font-black uppercase text-brand-primary leading-none mb-8">
                  {selectedSpeaker.name}
                </h2>
                
                <div className="space-y-12">
                  <section>
                    <h4 className="font-typewriter text-[9px] uppercase tracking-widest text-brand-primary/40 border-b border-brand-outline pb-4 mb-6">Manifesto Topic</h4>
                    <p className="font-title text-2xl uppercase text-brand-primary">{selectedSpeaker.topic}</p>
                  </section>

                  <section>
                    <h4 className="font-typewriter text-[9px] uppercase tracking-widest text-brand-primary/40 border-b border-brand-outline pb-4 mb-6">About</h4>
                    <p className="font-editorial text-xl italic text-brand-primary/70 leading-relaxed">
                      {selectedSpeaker.bio || "Sharing transformative insights on the intersection of humanity, technology, and the ticking clock of our shared existence."}
                    </p>
                  </section>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
