import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Mail, ArrowUpRight, Plus } from 'lucide-react';

const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] as const };

export default function About() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<null | 'sending' | 'success'>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      if (res.ok) setStatus('success');
    } catch (e) {
      console.error(e);
      setStatus(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40"
    >
      <div className="px-6 md:px-16 max-w-screen-2xl mx-auto">
        <header className="mb-32">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={transition}
          >
            <div className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase mb-12">Registry / Info</div>
            <h1 className="text-[10vw] font-title font-black tracking-tighter leading-[0.75] uppercase text-brand-primary">
              What it's <br /><span className="italic font-editorial lowercase -ml-6 text-brand-secondary">all about.</span>
            </h1>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-48">
          <div id="contact" className="space-y-16">
            <div className="p-12 border border-brand-outline bg-brand-surface space-y-8 rounded-[3rem] shadow-sm">
              <Mail className="text-brand-secondary" size={32} />
              <h2 className="text-4xl font-title font-black tracking-tighter uppercase leading-none text-brand-primary">Get <br /> Involved.</h2>
              
              {status === 'success' ? (
                <div className="font-editorial text-2xl text-brand-secondary italic">
                  Thanks for reaching out! We'll get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2 border-b border-brand-outline pb-4 focus-within:border-brand-secondary transition-colors">
                    <label className="font-typewriter text-[9px] uppercase tracking-widest text-brand-primary/40">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Salim Ahmed" 
                      className="w-full bg-transparent border-none focus:ring-0 font-editorial text-2xl italic text-brand-primary"
                      required
                      value={formState.name}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 border-b border-brand-outline pb-4 focus-within:border-brand-secondary transition-colors">
                    <label className="font-typewriter text-[9px] uppercase tracking-widest text-brand-primary/40">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="hello@example.com" 
                      className="w-full bg-transparent border-none focus:ring-0 font-editorial text-2xl italic text-brand-primary"
                      required
                      value={formState.email}
                      onChange={e => setFormState({...formState, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 border-b border-brand-outline pb-4 focus-within:border-brand-secondary transition-colors">
                    <label className="font-typewriter text-[9px] uppercase tracking-widest text-brand-primary/40">How do you want to help?</label>
                    <textarea 
                      placeholder="Tell us about your ideas..." 
                      className="w-full bg-transparent border-none focus:ring-0 font-editorial text-2xl italic text-brand-primary min-h-[100px] resize-none"
                      value={formState.message}
                      onChange={e => setFormState({...formState, message: e.target.value})}
                    />
                  </div>
                  <button 
                    disabled={status === 'sending'}
                    className="brutalist-button w-full group !bg-brand-secondary !text-white border-transparent"
                  >
                    {status === 'sending' ? 'Sending...' : 'Join the Conversation'}
                  </button>
                </form>
              )}
            </div>
            
            <div className="font-typewriter text-[10px] text-brand-primary/40 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
              <span className="text-brand-secondary">Note:</span> Everyone has a story to tell, and we are here to provide the platform.
            </div>
          </div>

          <div className="space-y-20">
            {[
              {
                title: "About TED",
                text: "TED is a nonprofit, nonpartisan organization devoted to Ideas Worth Spreading. Our mission is to discover and spread ideas that spark imagination, embrace possibility and catalyze impact. Started as a four-day conference in California 30 years ago, TED has grown to support its mission with multiple initiatives."
              },
              {
                title: "About TEDx",
                text: "In the spirit of ideas worth spreading, TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. At a TEDx event, TED Talks video and live speakers combine to spark deep discussion and connection. These local, self-organized events are branded TEDx, where x = independently organized TED event. The TED Conference provides general guidance for the TEDx program, but individual TEDx events are self-organized."
              },
              {
                title: "TEDxAlMuntazirSchoolsYouth",
                text: "Our event is run entirely by students, for the community of Dar es Salaam. We are exploring the theme of 'Borrowed Time' and how we individually and collectively choose to spend the moments we have."
              }
            ].map((item, i) => (
              <div key={item.title} className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="font-typewriter text-[10px] text-brand-secondary">0{i+1}</span>
                  <div className="h-[1px] flex-grow bg-brand-outline" />
                </div>
                <h3 className="text-4xl font-title font-black tracking-tighter uppercase text-brand-primary">{item.title}</h3>
                <p className="font-editorial text-xl text-brand-primary/60 leading-tight italic">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The Team Assembly */}
        <section className="py-40 border-t border-brand-outline">
          <div className="mb-24">
            <span className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase mb-12">The Assembly / Crew</span>
            <h2 className="text-6xl md:text-9xl font-title font-black tracking-tighter uppercase leading-[0.8] text-brand-primary">
              The <br /><span className="italic font-editorial lowercase text-brand-secondary">Architects.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {[
              { 
                category: 'Executive Team', 
                members: [
                  { name: 'Syed Ataa Abbas Abdi', year: '', lead: true, title: 'Lead' },
                  { name: 'Naiyl Othman', year: '', lead: true, title: 'Executive Lead' },
                  { name: 'Maryam Sheriff', year: '', lead: true, title: 'Executive Lead' }
                ] 
              },
              { 
                category: 'Curation', 
                members: [
                  { name: 'Zahra Karim', year: '12' }, 
                  { name: 'TJ Franklin', year: '12' }, 
                  { name: 'Khairoon Rizwan', year: '11' }, 
                  { name: 'Aliyah Jusabani', year: '12', lead: true, title: 'Team Lead' }
                ] 
              },
              { 
                category: 'Production', 
                members: [
                  { name: 'Abbas Dharsee', year: '13', lead: true, title: 'Team Lead' },
                  { name: 'Husseinali Sharif', year: '12' },
                  { name: 'Nayah Gangi', year: '12' },
                  { name: 'Muhammed Omar', year: '12' },
                  { name: 'Dhara Gajjar', year: '11' },
                  { name: 'Mohammed Datoo', year: '12' }
                ] 
              },
              { 
                category: 'Marketing', 
                members: [
                  { name: 'Malka Khalid', year: '10' },
                  { name: 'Kazim sherzaman', year: '12' },
                  { name: 'Raudha Fahmi', year: '12' },
                  { name: 'Mehreen Akthar', year: '12', lead: true, title: 'Team Lead' },
                  { name: 'Sarah sumar', year: '12' }
                ] 
              },
              { 
                category: 'Logistics', 
                members: [
                  { name: 'Sahal Harunani', year: '12', lead: true, title: 'Team Lead' },
                  { name: 'Caliana Hasham', year: '11' },
                  { name: 'Deeva Bhograthania', year: '10' },
                  { name: 'Maria Bhaijee', year: '' },
                  { name: 'Sakina Dhirani', year: '10' },
                  { name: 'Umar Malik', year: '12' }
                ] 
              },
              { 
                category: 'Finance', 
                members: [
                  { name: 'Fadhlun Albeity', year: '10' },
                  { name: 'Amaan Sheriff', year: '12' },
                  { name: 'Ali Jawad Nanji', year: '12' },
                  { name: 'Falak Mawji', year: '12', lead: true, title: 'Team Lead' },
                  { name: 'Mohammad raza muraj', year: '11' }
                ] 
              }
            ].map((group) => (
              <div key={group.category} className="space-y-6">
                <h4 className="font-title text-3xl uppercase text-brand-primary border-b border-brand-outline pb-4 flex justify-between items-baseline">
                  {group.category}
                  <span className="font-typewriter text-[9px] text-brand-secondary opacity-50 tracking-widest">{group.members.length} Units</span>
                </h4>
                <div className="space-y-3">
                  {group.members.map((m) => (
                    <div key={m.name} className="flex justify-between items-baseline hover:pl-2 transition-all duration-300">
                      <div className="flex gap-2 items-center text-brand-primary">
                        <span className={`font-sans text-lg ${m.lead ? 'font-bold' : 'opacity-60'}`}>{m.name}</span>
                        {m.lead && <span className="text-[10px] bg-brand-secondary text-white px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter shrink-0">{m.title || 'Lead'}</span>}
                      </div>
                      <span className="font-typewriter text-[10px] text-brand-primary/20 shrink-0">{m.year ? `Year ${m.year}` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
