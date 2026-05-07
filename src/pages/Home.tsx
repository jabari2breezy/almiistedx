import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Clock, Hourglass, Watch, Timer, History, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';

const transition = { duration: 1.6, ease: [0.76, 0, 0.24, 1] };

interface EventStatus {
  status: 'upcoming' | 'live';
  eventDate: string;
  daysRemaining: number;
  secondsRemaining: number;
}

interface TicketStatus {
  remaining: number;
  total: number;
  status: string;
}

interface Update {
  id: string;
  title: string;
  date: string;
  content: string;
}

function ParallaxIcon({ icon: Icon, speed, left, top, delay = 0, size = 120 }: { 
  icon: any, 
  speed: number, 
  left: string, 
  top: string, 
  delay?: number,
  size?: number 
}) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, speed * 1000]);
  const scrollRotate = useTransform(scrollY, [0, 1000], [0, speed * 45]);

  // Unique durations for each icon to avoid synchronized movement
  const floatDuration = 4 + (Math.random() * 3);
  const driftDuration = 5 + (Math.random() * 3);
  const rotateDuration = 7 + (Math.random() * 3);

  return (
    <motion.div
      style={{ y, left, top }}
      className="absolute pointer-events-none text-brand-primary"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 0.03, 
          scale: 1,
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{ 
          opacity: { duration: 1, delay },
          scale: { duration: 1, delay },
          y: { 
            duration: floatDuration, 
            repeat: Infinity, 
            ease: "easeInOut" 
          },
          x: { 
            duration: driftDuration, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }
        }}
        style={{ rotate: scrollRotate }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ 
            duration: rotateDuration, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Icon size={size} strokeWidth={0.5} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function AnimatedText({ text, delay = 0 }: { text: string, delay?: number }) {
  return (
    <div className="char-reveal relative">
      <motion.span
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ ...transition, delay }}
        className="block"
      >
        {text}
      </motion.span>
    </div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eventStatus, setEventStatus] = useState<EventStatus | null>(null);
  const [ticketStatus, setTicketStatus] = useState<TicketStatus | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const liquidY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const charX = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const circleY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    fetch('/api/event-status')
      .then(res => res.json())
      .then(setEventStatus);
    
    fetch('/api/updates')
      .then(res => res.json())
      .then(setUpdates);

    fetch('/api/tickets')
      .then(res => res.json())
      .then(setTicketStatus);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus('loading');
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setSubStatus('success');
      setEmail('');
      setTimeout(() => setSubStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setSubStatus('idle');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40"
      ref={containerRef}
    >
      {/* Hero Section */}
      <div className="px-6 md:px-16 py-20 min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
        {/* Parallax Time Icons */}
        <ParallaxIcon icon={Clock} speed={0.05} left="10%" top="15%" size={200} />
        <ParallaxIcon icon={Hourglass} speed={0.15} left="85%" top="5%" size={180} />
        <ParallaxIcon icon={Watch} speed={-0.1} left="70%" top="60%" size={150} />
        <ParallaxIcon icon={Timer} speed={0.08} left="5%" top="75%" size={220} />
        <ParallaxIcon icon={History} speed={-0.05} left="40%" top="10%" size={120} />
        <ParallaxIcon icon={Clock} speed={0.12} left="25%" top="85%" size={180} />
        <ParallaxIcon icon={Hourglass} speed={-0.2} left="90%" top="40%" size={140} />

        {/* Dynamic Background Elements with Parallax */}
        <motion.div 
          style={{ y: liquidY }}
          className="absolute inset-0 liquid-bg opacity-20 pointer-events-none" 
        />
        
        {/* Floating Background Text/Shapes */}
        <motion.div 
          style={{ x: charX, opacity: 0.05 }}
          className="absolute -top-20 -right-20 pointer-events-none select-none"
        >
          <span className="text-[40vw] font-title font-black text-brand-primary leading-none">X</span>
        </motion.div>

        <motion.div 
          style={{ y: circleY }}
          className="absolute top-1/2 left-1/4 w-96 h-96 border border-brand-secondary/10 rounded-full pointer-events-none"
        />

        <div className="max-w-screen-2xl mx-auto w-full relative z-10">
          <motion.div style={{ opacity: textOpacity }} className="flex flex-col gap-2 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-6 text-brand-secondary font-typewriter text-[10px] uppercase tracking-[0.8em]"
            >
              <div className="w-16 h-[1px] bg-brand-secondary/40" />
              {eventStatus ? `${eventStatus.daysRemaining} DAYS REMAINING` : 'Event / 14th June 2026'}
            </motion.div>
            
            <h1 className="text-[12vw] md:text-[10vw] font-title font-black tracking-tighter leading-[0.78] uppercase flex flex-col pt-8 text-brand-primary">
              <AnimatedText text="TEDx" />
              <div className="flex items-baseline gap-4">
                <span className="italic font-editorial lowercase -ml-4 pr-4 text-brand-secondary">AlMuntazir</span>
                <AnimatedText text="2026" delay={0.2} />
              </div>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
            <motion.div 
              className="md:col-span-8 lg:col-span-7"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.6 }}
            >
            <p className="font-editorial text-3xl md:text-5xl text-brand-primary leading-[1.1] italic">
                We're living on <span className="text-brand-secondary font-title not-italic uppercase">Borrowed Time</span>. 
              </p>
              <p className="mt-8 font-sans text-xl text-brand-primary/70 max-w-3xl leading-relaxed">
                This theme explores the idea that the time we have individually and collectively is limited, and what we choose to do with it matters. 
                Inviting conversations on the systems, choices and moments that shape our world, whether that means preserving the past, fixing the present or reimagining a new future.
              </p>
            </motion.div>

            <motion.div
              className="md:col-start-9 md:col-span-4 flex flex-col gap-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...transition, delay: 0.8 }}
            >
              <div className="flex flex-col gap-2 font-typewriter text-[10px] uppercase tracking-[0.4em] text-brand-primary/40">
                <span>Location</span>
                <span className="text-brand-primary font-bold">ALMUNTAZIR ISLAMIC INTERNATIONAL SCHOOL - Nursery Campus</span>
              </div>

              {/* Ticket Status */}
              {ticketStatus && (
                <div className="flex items-center justify-between p-6 bg-brand-primary text-white rounded-2xl overflow-hidden relative group">
                  <div className="relative z-10 flex flex-col">
                    <span className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/40">Status: {ticketStatus.status}</span>
                    <span className="font-title text-2xl font-black">{ticketStatus.remaining} / {ticketStatus.total}</span>
                    <span className="font-typewriter text-[9px] uppercase tracking-[0.2em] text-brand-secondary">Remaining Tokens</span>
                  </div>
                  <div className="relative z-10 flex h-1.5 w-24 bg-white/10 rounded-full overflow-hidden self-end mb-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(ticketStatus.remaining / ticketStatus.total) * 100}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-brand-secondary"
                    />
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                    <Clock size={80} />
                  </div>
                </div>
              )}

              {/* Countdown or Register Link */}
              {eventStatus?.status === 'live' ? (
                <div className="bg-brand-secondary/10 border border-brand-secondary p-8 rounded-3xl flex items-center gap-4 animate-pulse">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="font-title uppercase font-black text-brand-secondary">Assembly is Live</span>
                </div>
              ) : (
                <Link to="/speakers" className="brutalist-button w-full group !bg-brand-secondary !text-white border-transparent">
                  <span className="flex items-center gap-6">
                    MEET THE SPEAKERS <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform duration-500" />
                  </span>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Latest Updates Section */}
      <section className="px-6 md:px-16 py-20 border-t border-brand-outline bg-brand-surface/50">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Zap size={20} className="text-brand-secondary" />
            <h3 className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-primary/40">Latest Updates</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {updates.length === 0 ? (
                [1,2,3].map(i => <div key={i} className="h-40 bg-brand-outline/20 rounded-3xl animate-pulse" />)
            ) : (
              updates.map(update => (
                <motion.div 
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-3xl border border-brand-outline hover:border-brand-secondary/30 transition-colors"
                >
                  <span className="text-[10px] font-typewriter text-brand-secondary mb-4 block uppercase tracking-widest">{update.date}</span>
                  <h4 className="font-title text-xl text-brand-primary mb-2 uppercase">{update.title}</h4>
                  <p className="font-editorial text-lg text-brand-primary/60 italic leading-tight">{update.content}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Manifest Section */}
      <section className="px-6 md:px-16 py-40 max-w-screen-2xl mx-auto border-t border-brand-outline relative overflow-hidden">
        {/* Parallax Time Icons for Manifest section */}
        <ParallaxIcon icon={Timer} speed={-0.12} left="80%" top="20%" size={250} />
        <ParallaxIcon icon={Clock} speed={0.06} left="60%" top="70%" size={200} />
        <ParallaxIcon icon={History} speed={0.18} left="15%" top="50%" size={180} />
        <ParallaxIcon icon={Watch} speed={-0.08} left="35%" top="15%" size={130} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-7xl md:text-9xl font-title font-black leading-[0.8] uppercase text-brand-primary">
              The <br /><span className="text-brand-secondary italic lowercase">Horizons.</span>
            </h2>
            <p className="font-sans text-2xl text-brand-primary/80 leading-relaxed max-w-xl">
              This theme explores the idea that the time we have individually and collectively is limited, and what we choose to do with it matters. 
              Inviting conversations on the systems, choices and moments that shape our world.
            </p>
          </motion.div>
          
          <div className="space-y-12">
            {[
              { 
                title: 'Preserving the Past', 
                sub: 'Heritage', 
                text: 'The debt we inherited from history. Understanding the foundations that shape our current reality.' 
              },
              { 
                title: 'Fixing the Present', 
                sub: 'Urgency', 
                text: 'The only moment we actually have. Using the present to address the challenges of our time.' 
              },
              { 
                title: 'Reimagining a Future', 
                sub: 'Legacy', 
                text: 'The worlds we will never inhabit. Defining our responsibility for the generations to come.' 
              }
            ].map((item, i) => (
              <motion.div 
                key={item.title} 
                className="p-10 border border-brand-outline rounded-3xl hover:border-brand-secondary transition-all group bg-white shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="font-typewriter text-[10px] text-brand-secondary uppercase tracking-[0.4em]">Unit_0{i+1}</span>
                  <span className="font-editorial text-sm italic text-brand-primary/30 uppercase">{item.sub}</span>
                </div>
                <h4 className="font-title text-3xl uppercase text-brand-primary mb-4">{item.title}</h4>
                <p className="font-editorial text-xl text-brand-primary/60 italic leading-tight group-hover:text-brand-primary transition-colors">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 md:px-16 py-40 bg-brand-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 liquid-bg opacity-10" />
        <div className="max-w-screen-2xl mx-auto relative z-10 text-center flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="font-kinetic text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-6">
                Don't let the <br /><span className="text-brand-secondary italic">Clock Run Out.</span>
              </h3>
              <p className="font-editorial text-xl md:text-2xl text-white/40 italic max-w-2xl mx-auto">
                Join our newsletter to receive event insights, speaker announcements, and thought pieces on our limited time.
              </p>
            </motion.div>

            <form onSubmit={handleSubscribe} className="relative w-full max-w-xl group">
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR_EMAIL_ADDRESS"
                className="w-full bg-transparent border-b border-white/20 py-6 font-typewriter text-sm tracking-[0.2em] focus:outline-none focus:border-brand-secondary transition-colors text-center"
              />
              <button 
                type="submit"
                disabled={subStatus !== 'idle'}
                className="mt-12 brutalist-button w-full border-white/10 hover:border-brand-secondary"
              >
                {subStatus === 'idle' ? 'SUBSCRIBE TO THE STREAM' : subStatus === 'loading' ? 'TRANSMITTING...' : 'WELCOME TO THE CIRCLE'}
              </button>
            </form>
        </div>
      </section>
    </motion.div>
  );
}
