import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEGMENTS } from '../constants';
import { Search, Plus } from 'lucide-react';

const transition = { duration: 0.8, ease: [0.76, 0, 0.24, 1] };

export default function Speakers() {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [speakersData, setSpeakersData] = useState<{ id: string; name: string; topic: string; segmentId: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
              <span>The</span>
              <span className="italic font-editorial lowercase -ml-6 text-brand-secondary">Assembly.</span>
            </h1>
          </motion.div>
          <div className="max-w-xs font-editorial text-2xl text-brand-primary/40 italic leading-tight">
            Meet the people asking: What are you doing with the time you’ve got?
          </div>
        </header>

        {/* Dynamic Filter / Search */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20 border-y border-brand-outline py-12">
          <div className="flex flex-wrap gap-8">
            {['all', ...SEGMENTS.map(s => s.id)].map(id => (
              <button
                key={id}
                onClick={() => setSelectedSegment(id)}
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
            <AnimatePresence mode="popLayout">
              {filteredSpeakers.map((speaker, i) => (
              <motion.div
                key={speaker.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
                className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 py-16 border-b border-brand-outline hover:bg-brand-surface transition-colors px-6 -mx-6 rounded-[2rem] items-center"
              >
                <div className="md:col-span-1 font-typewriter text-[11px] text-brand-primary/20 group-hover:text-brand-secondary transition-colors">
                  0{i + 1}
                </div>
                <div className="md:col-span-5">
                  <h3 className="text-4xl md:text-6xl font-title font-black tracking-tighter text-brand-primary group-hover:pl-4 transition-all duration-500 uppercase">
                    {speaker.name}
                  </h3>
                </div>
                <div className="md:col-span-5 pb-4 md:pb-0">
                  <p className="font-editorial text-2xl md:text-3xl text-brand-primary/40 italic leading-tight group-hover:text-brand-primary transition-colors">
                    "{speaker.topic}"
                  </p>
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <button className="w-16 h-16 rounded-full border-2 border-brand-outline flex items-center justify-center group-hover:bg-brand-secondary group-hover:border-brand-secondary transition-all text-brand-primary group-hover:text-white">
                    <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                  </button>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}
