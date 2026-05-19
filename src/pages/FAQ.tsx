import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Ticket, MapPin, Lightbulb } from 'lucide-react';

const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] as const };

const FAQ_DATA = [
  {
    category: "Ticketing & Registration",
    icon: <Ticket size={18} />,
    questions: [
      {
        q: "How do I secure a ticket for TEDxAlMuntazir?",
        a: "Students can register and purchase tickets directly at school between 25th - 10th June. Due to limited venue capacity, tickets are allocated on a first-come, first-served basis."
      },
      {
        q: "What does my ticket include?",
        a: "Your ticket grants you full access to all live speaker sessions, interactive workshop zones, premium networking breaks, official TEDxAlMuntazir merchandise, and a curated lunch/refreshments experience."
      },
      {
        q: "Can I get a refund or transfer my ticket to someone else?",
        a: "All ticket sales are final and non-refundable. However, you can transfer your ticket to another AlMuntazir student up to 48 hours before the event, provided you notify the organizers beforehand."
      }
    ]
  },
  {
    category: "Event Logistics & Venue",
    icon: <MapPin size={18} />,
    questions: [
      {
        q: "When and where is TEDxAlMuntazir taking place?",
        a: "The event takes place in 2026 at the Al Muntazir Islamic International Schools - Nursery Campus. Doors open strictly at 9:30 AM for registration and morning networking, with the first session starting at 10:00 AM."
      },
      {
        q: "What is the dress code for the event?",
        a: "The dress code is Smart Casual or Business Casual. We highly encourage attendees to lean into sophisticated, sharp attire that matches the premium atmosphere of the conference."
      },
      {
        q: "Will the event be streamed online?",
        a: "TEDxAlMuntazir is designed as an immersive, in-person experience to maximize networking and engagement. While the talks will be recorded and uploaded to the official TEDx YouTube channel after the event, there will be no live stream on the day."
      }
    ]
  },
  {
    category: "Theme & Content",
    icon: <Lightbulb size={18} />,
    questions: [
      {
        q: "What is the inspiration behind this year’s theme, 'Borrowed Time'?",
        a: "'Borrowed Time' explores the urgency of the human experience, examining how we navigate finite moments, push boundaries in innovation, and make impactful choices before our window of opportunity closes. Our speakers will approach this from technological, cultural, and deeply personal perspectives."
      },
      {
        q: "Who are the speakers this year?",
        a: "You can view the full speaker profiles in the Speakers Section of our website. We have a diverse lineup of student voices sharing 'Ideas Worth Spreading'."
      }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(FAQ_DATA[0].category);

  // Intersection Observer to update active category on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.getAttribute('data-category') || "");
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('.faq-section').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToCategory = (category: string) => {
    const element = document.querySelector(`[data-category="${category}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
      className="min-h-screen bg-white"
    >
      <div className="px-6 md:px-16 max-w-screen-2xl mx-auto pt-40 pb-32">
        <header className="mb-32">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col gap-4"
          >
            <span className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase">Information Center</span>
            <h1 className="text-7xl md:text-[8vw] font-title font-black tracking-tighter uppercase leading-[0.8] text-brand-primary">
              The <br /><span className="italic font-editorial lowercase text-brand-secondary">Essentials.</span>
            </h1>
          </motion.div>
        </header>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left Sidebar - Categories */}
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-40 space-y-2">
              {FAQ_DATA.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => scrollToCategory(cat.category)}
                  className={`w-full text-left p-6 rounded-2xl flex items-center justify-between transition-all duration-500 group ${
                    activeCategory === cat.category 
                    ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20' 
                    : 'bg-brand-surface text-brand-primary/60 hover:bg-brand-outline/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${
                       activeCategory === cat.category ? 'bg-white/10' : 'bg-white'
                    }`}>
                      {cat.icon}
                    </div>
                    <span className="font-title font-black uppercase tracking-tight text-sm md:text-base">
                      {cat.category}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                    activeCategory === cat.category ? 'border-white/40 rotate-90' : 'border-brand-outline group-hover:bg-brand-primary group-hover:text-white'
                  }`}>
                    <Plus size={12} className={activeCategory === cat.category ? 'rotate-45' : ''} />
                  </div>
                </button>
              ))}

              <div className="mt-12 p-8 bg-brand-surface rounded-[2rem] border border-brand-outline space-y-4">
                <span className="font-typewriter text-[9px] uppercase tracking-widest text-brand-primary/40 block">Still curious?</span>
                <p className="font-editorial text-xl italic text-brand-primary/60 leading-tight">
                  If you have a specific question not answered here, reach out to our team.
                </p>
                <a href="mailto:info@tedxalmuntazir.com" className="inline-block font-sans font-bold text-xs uppercase tracking-widest text-brand-secondary hover:underline">
                  Contact Organizers
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Questions */}
          <div className="lg:w-2/3 space-y-32">
            {FAQ_DATA.map((cat) => (
              <section 
                key={cat.category} 
                data-category={cat.category}
                className="faq-section space-y-12"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-[1px] bg-brand-outline" />
                  <span className="font-typewriter text-[10px] text-brand-secondary tracking-[0.5em] uppercase">{cat.category}</span>
                </div>

                <div className="space-y-6">
                  {cat.questions.map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="group p-8 md:p-10 bg-brand-surface border border-brand-outline rounded-[2.5rem] hover:border-brand-primary/20 transition-all duration-500 shadow-sm hover:shadow-md"
                    >
                      <h4 className="text-2xl md:text-3xl font-title font-black uppercase text-brand-primary tracking-tighter mb-6 leading-none">
                        {faq.q}
                      </h4>
                      <p className="font-editorial text-xl md:text-2xl text-brand-primary/60 italic leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
