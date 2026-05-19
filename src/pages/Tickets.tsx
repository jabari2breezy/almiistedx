import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function Tickets() {
  const [ticketsLeft, setTicketsLeft] = useState(100); // Mock inventory
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [ticketImage, setTicketImage] = useState<string | null>(null);

  const TICKET_PRICE = 30000; // TZS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/buy-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTicketNumber(data.ticketNumber);
        setTicketImage(data.ticketImageBase64);
        setTicketsLeft(prev => Math.max(0, prev - 1));
      } else {
        alert("Payment failed: " + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error(error);
      alert("Payment processing error");
    } finally {
      setIsProcessing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-brand-background pt-32 pb-20 px-6 md:px-16 text-brand-primary">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <span className="font-typewriter text-xs uppercase tracking-[0.5em] text-brand-secondary">Secure Your Spot</span>
            <h1 className="text-5xl md:text-7xl font-title font-black uppercase tracking-tighter">
              Get Your Tickets
            </h1>
            <p className="font-editorial text-2xl md:text-3xl text-brand-primary/60 italic">
              Don't wait. We're living on borrowed time.
            </p>
          </motion.div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-brand-surface border border-brand-secondary p-12 rounded-lg text-center space-y-6"
            >
              <div className="w-20 h-20 bg-brand-secondary/20 text-brand-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-title font-black uppercase tracking-tight">Payment Successful</h2>
              <p className="text-brand-primary/70 max-w-md mx-auto">
                Thank you, {formData.name}. Your ticket has been secured and sent to {formData.email}.
              </p>
              
              {ticketImage ? (
                <div className="mt-8 rounded-sm overflow-hidden border border-brand-outline shadow-2xl relative max-w-2xl mx-auto">
                  <img src={ticketImage} alt="Your TEDx Ticket" className="w-full h-auto block" />
                </div>
              ) : (
                <div className="bg-brand-background py-6 px-8 inline-block border border-brand-outline rounded mt-4">
                  <span className="block font-typewriter text-[10px] uppercase tracking-widest text-brand-primary/50 mb-2">Your Ticket Number</span>
                  <span className="text-5xl font-black font-title text-brand-secondary">#{ticketNumber}</span>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div variants={itemVariants} className="space-y-8">
                <div className="bg-brand-surface p-8 border border-brand-outline rounded-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-title font-bold text-xl uppercase">General Admission</h3>
                    <span className="font-typewriter text-brand-secondary font-bold">TZS 30,000</span>
                  </div>
                  <div className="space-y-4 text-sm text-brand-primary/70">
                    <p>✓ Full day access to all talks</p>
                    <p>✓ Networking lunch included</p>
                    <p>✓ Exclusive attendee gift bag</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-brand-outline flex justify-between items-center">
                    <span className="font-typewriter text-xs uppercase tracking-widest text-brand-primary/50">Availability</span>
                    <span className="font-bold text-lg bg-brand-background px-3 py-1 rounded border border-brand-outline shadow-sm">
                      <span className={ticketsLeft < 20 ? "text-red-500" : "text-brand-secondary"}>{ticketsLeft}</span> Left
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-typewriter text-[10px] uppercase tracking-widest text-brand-primary/50">Supported Payment Methods</h4>
                  <div className="flex flex-wrap gap-4 opacity-70 grayscale">
                    <div className="px-4 py-2 border border-brand-outline rounded bg-brand-surface text-xs font-bold">Selcom</div>
                    <div className="px-4 py-2 border border-brand-outline rounded bg-brand-surface text-xs font-bold text-red-600">Airtel Money</div>
                    <div className="px-4 py-2 border border-brand-outline rounded bg-brand-surface text-xs font-bold text-yellow-600">HaloPesa</div>
                    <div className="px-4 py-2 border border-brand-outline rounded bg-brand-surface text-xs font-bold text-blue-600">Cards (Mastercard/Tembo)</div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-brand-surface p-8 border border-brand-outline rounded-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-typewriter text-xs uppercase tracking-widest text-brand-primary/70 block">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-brand-background border border-brand-outline px-4 py-3 rounded text-brand-primary focus:outline-none focus:border-brand-secondary transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-typewriter text-xs uppercase tracking-widest text-brand-primary/70 block">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-brand-background border border-brand-outline px-4 py-3 rounded text-brand-primary focus:outline-none focus:border-brand-secondary transition-colors"
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-typewriter text-xs uppercase tracking-widest text-brand-primary/70 block">Phone Number (Mobile Money)</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-brand-background border border-brand-outline px-4 py-3 rounded text-brand-primary focus:outline-none focus:border-brand-secondary transition-colors"
                      placeholder="07XX XXX XXX"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessing || ticketsLeft === 0}
                    className="w-full bg-brand-primary text-brand-background font-title font-bold uppercase tracking-wider py-4 rounded hover:bg-brand-secondary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isProcessing ? (
                      <span className="w-5 h-5 border-2 border-brand-background border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span>Pay TZS 30,000</span>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-brand-primary/40 font-typewriter uppercase tracking-widest mt-4">
                    Secured via Mock Gateway
                  </p>
                </form>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
