import { motion } from 'motion/react';
import { Quote, Clock, ShieldAlert, Sparkles, Zap } from 'lucide-react';

const transition = { duration: 1.2, ease: [0.76, 0, 0.24, 1] };

export default function Theme() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-brand-background"
    >
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-16 max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={transition}
        >
          <div className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase mb-12">The Manifesto</div>
          <h1 className="text-[14vw] font-title font-black tracking-tighter leading-[0.75] uppercase flex flex-col mb-20 text-brand-primary">
            <span>Borrowed</span>
            <span className="italic font-editorial lowercase -ml-6 text-brand-secondary">Time.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-1 hidden lg:block">
              <div className="rotate-90 origin-top-left font-typewriter text-[9px] uppercase tracking-[1em] text-brand-primary/20 whitespace-nowrap pt-4 underline underline-offset-[12px] decoration-brand-secondary">
                THE PREMISE
              </div>
            </div>
            
            <div className="lg:col-span-11 space-y-12">
              <p className="font-editorial text-4xl md:text-7xl font-medium tracking-tight text-brand-primary leading-[0.9] italic lowercase">
                None of us <span className="text-brand-secondary not-italic font-title font-black uppercase inline-block pr-6">choose</span> our arrival and departure in this world. Between those two moments lies everything.
              </p>
              <div className="h-[2px] w-24 bg-brand-secondary" />
              <p className="font-sans text-2xl text-brand-primary/70 leading-relaxed max-w-3xl">
                We're all living on borrowed time. But borrowed time isn't wasted time. 
                History's most defining moments were shaped by people who understood the weight of their moment, 
                people who looked at the world as it was and dared to imagine what it could become.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Philosophy Section */}
      <section className="py-40 bg-brand-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 liquid-bg opacity-10" />
        <div className="px-6 md:px-16 max-w-screen-2xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={transition}
            >
              <h2 className="text-6xl md:text-8xl font-title font-black tracking-tighter uppercase leading-none mb-12">
                Accumulation <br /> Of <span className="text-brand-secondary">Decisions.</span>
              </h2>
              <p className="font-editorial text-2xl md:text-3xl text-white/60 italic leading-tight mb-8">
                "History has never been shaped by a single grand gesture. It's been shaped by the accumulation of a million ordinary decisions made by ordinary people."
              </p>
              <p className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-secondary">
                The question isn't how much time we have. It's what we do with it.
              </p>
            </motion.div>
            <div className="relative">
                <div className="absolute -inset-20 bg-brand-secondary/20 blur-[100px] rounded-full animate-pulse" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                  className="relative opacity-10"
                >
                  <Clock size={400} className="text-white" strokeWidth={0.5} />
                </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* The Invitations */}
      <section className="py-40 px-6 md:px-16 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4 mb-20">
          <ShieldAlert size={20} className="text-brand-secondary" />
          <h3 className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-primary/40">The Inciting Questions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-outline">
          {[
            { 
              title: 'Warming Planet', 
              icon: <Zap size={24} />,
              text: 'What it actually means to live responsibly on a warming planet. Navigating ecological urgency.' 
            },
            { 
              title: 'Artificial Intelligence', 
              icon: <Sparkles size={24} />,
              text: 'To grow up alongside artificial intelligence without losing what makes us human.' 
            },
            { 
              title: 'Pursuing Peace', 
              icon: <Clock size={24} />,
              text: 'To pursue peace in a world that keeps making war feel inevitable.' 
            },
            { 
              title: 'Reimagining Systems', 
              icon: <Quote size={24} />,
              text: 'To inherit systems you didn\'t design and decide whether to maintain them or reimagine them entirely.' 
            }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-background p-12 group hover:bg-brand-surface transition-colors"
            >
              <div className="text-brand-secondary mb-8 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
              <h4 className="font-title text-4xl font-black uppercase tracking-tighter mb-4 text-brand-primary">{item.title}</h4>
              <p className="font-editorial text-xl italic text-brand-primary/60 leading-tight">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final Call */}
      <section className="py-40 px-6 md:px-16 border-t border-brand-outline bg-brand-surface">
        <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h2 className="text-5xl md:text-8xl font-title font-black tracking-tighter leading-[0.8] uppercase text-brand-primary">
                A conference about <span className="text-brand-secondary italic">Urgency,</span> not doom.
              </h2>
              <p className="font-editorial text-2xl md:text-4xl italic text-brand-primary/40 leading-tight">
                "And the extraordinary things that humans do when they feel it."
              </p>
              <div className="pt-20">
                <div className="font-typewriter text-[12px] uppercase tracking-[1em] text-brand-secondary animate-pulse mb-8">The clock's ticking.</div>
                <div className="text-[12vw] font-title font-black uppercase tracking-tighter text-brand-primary opacity-5 select-none leading-none">THE STAGE IS YOURS</div>
              </div>
            </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
