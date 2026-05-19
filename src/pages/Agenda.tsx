import { motion } from 'motion/react';

const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] as const };

export default function Agenda() {
  const agendaItems = [
    { time: '10:00 - 10:20', title: 'Ridhwan Mohammed', sub: 'Topic TBA', theme: 'past' },
    { time: '10:20 - 10:40', title: 'Anaya Rashid', sub: 'The Culture of Time', theme: 'past' },
    { time: '10:40 - 11:00', title: 'Zahra Datoo', sub: 'The Architecture of Nostalgia', theme: 'past' },
    
    { time: '11:00 - 11:20', title: 'Zahra Moledina', sub: "Capitalism's Clock", theme: 'present' },
    { time: '11:20 - 11:40', title: 'Faizaan', sub: 'Topic TBA', theme: 'present' },
    { time: '11:40 - 12:00', title: 'Hassan Abbas Mohammed', sub: 'The Procrastination Paradox', theme: 'present' },
    
    { time: '12:00 - 13:00', title: 'Lunch & Prayer', sub: 'Nourishment & Reflection', theme: 'present' },
    { time: '13:00 - 13:30', title: 'Interactive Activities', sub: 'The Kahoot Challenge & Energy Boost', theme: 'present' },

    { time: '13:30 - 13:50', title: 'Yunus Osman', sub: 'The Art of Scheduling', theme: 'future' },
    { time: '13:50 - 14:10', title: 'Sada Mbaruk Said', sub: 'Three Clocks: Climate, Animals, AI', theme: 'future' },
    { time: '14:10 - 14:30', title: 'Liyaan Karbelkar', sub: 'The Legacy We Leave', theme: 'future' },
    
    { time: '14:30 - 14:45', title: 'Sponsor Appreciation', sub: 'Gratitude for our Partners', theme: 'future' },
    { time: '14:45 - 15:00', title: 'Closing Manifesto', sub: 'Borrowed Time: The Beginning', theme: 'future' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
      className="pt-40 pb-32"
    >
      <div className="px-6 md:px-16 max-w-screen-2xl mx-auto">
        <header className="mb-24">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col gap-4"
          >
            <span className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase">The assembly</span>
            <h1 className="text-7xl md:text-[10vw] font-title font-black tracking-tighter uppercase leading-[0.8] text-brand-primary">
              Agenda.<br /><span className="italic font-editorial lowercase text-brand-secondary">Time Unfolding.</span>
            </h1>
          </motion.div>
        </header>

        <div className="space-y-48">
          {[
            { label: 'Past', title: 'Echoes & Foundations', items: agendaItems.filter(i => i.theme === 'past') },
            { label: 'Present', title: 'Presence & Power', items: agendaItems.filter(i => i.theme === 'present') },
            { label: 'Future', title: 'Reimagining Systems', items: agendaItems.filter(i => i.theme === 'future') }
          ].map((section, sIndex) => (
            <div key={section.label} className="space-y-16">
              <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12">
                <span className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase shrink-0">Section {sIndex + 1} / {section.label}</span>
                <div className="h-px bg-brand-outline flex-grow" />
                <h2 className="text-3xl md:text-4xl font-title font-black uppercase text-brand-primary tracking-tighter shrink-0">{section.title}</h2>
              </div>

              <div className="py-10 space-y-32">
                {section.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                    className="relative group"
                  >
                    <div className="space-y-6">
                      <span className="font-typewriter text-2xl md:text-4xl text-brand-primary/20 group-hover:text-brand-secondary transition-colors duration-500">
                        {item.time}
                      </span>
                      <div className="space-y-2">
                         <h3 className="text-4xl md:text-7xl font-title font-black uppercase text-brand-primary tracking-tight">
                           {item.title}
                         </h3>
                         <p className="font-editorial text-2xl md:text-3xl text-brand-primary/40 italic leading-tight">
                           {item.sub}
                         </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
