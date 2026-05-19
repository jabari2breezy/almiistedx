import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [ticketImage, setTicketImage] = useState<string | null>(null);

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
      <div className="max-w-3xl mx-auto">
        <Link to="/tickets" className="inline-flex items-center gap-2 font-typewriter text-[10px] uppercase tracking-widest text-brand-primary/50 hover:text-brand-primary transition-colors mb-12">
          <ArrowLeft size={14} /> Back to Tickets
        </Link>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-title font-black uppercase tracking-tighter">Payment Successful</h2>
              <p className="text-brand-primary/70 max-w-md mx-auto font-editorial text-xl">
                Thank you, {formData.name}. Your ticket has been secured and sent to {formData.email}.
              </p>
              
              {ticketImage ? (
                <div className="mt-12 rounded-sm overflow-hidden border border-brand-outline shadow-2xl relative max-w-2xl mx-auto">
                  <img src={ticketImage} alt="Your TEDx Ticket" className="w-full h-auto block" />
                </div>
              ) : (
                <div className="bg-brand-surface py-8 px-12 inline-block border border-brand-outline rounded mt-8">
                  <span className="block font-typewriter text-[10px] uppercase tracking-widest text-brand-primary/50 mb-4">Your Ticket Number</span>
                  <span className="text-6xl font-black font-title text-brand-secondary">#{ticketNumber}</span>
                </div>
              )}

              <div className="pt-12">
                <Link to="/" className="inline-flex items-center justify-center px-8 py-4 border border-brand-outline font-typewriter text-[10px] uppercase tracking-widest hover:bg-brand-primary hover:text-brand-background transition-all">
                  Return Home
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="bg-brand-surface p-8 md:p-12 border border-brand-outline rounded-sm">
              <div className="mb-12">
                <h1 className="text-4xl font-title font-black uppercase tracking-tighter mb-2">Checkout</h1>
                <p className="font-editorial text-lg text-brand-primary/60">Complete your registration for TEDxAlMuntazirSchoolsYouth.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="font-typewriter text-xs uppercase tracking-widest text-brand-primary/70 block">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-brand-background border border-brand-outline px-4 py-4 rounded text-brand-primary focus:outline-none focus:border-brand-secondary transition-colors"
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
                    className="w-full bg-brand-background border border-brand-outline px-4 py-4 rounded text-brand-primary focus:outline-none focus:border-brand-secondary transition-colors"
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
                    className="w-full bg-brand-background border border-brand-outline px-4 py-4 rounded text-brand-primary focus:outline-none focus:border-brand-secondary transition-colors"
                    placeholder="07XX XXX XXX"
                  />
                </div>

                <div className="pt-6 border-t border-brand-outline flex justify-between items-center mb-8">
                  <span className="font-title font-bold text-xl uppercase">Total</span>
                  <span className="font-typewriter text-brand-secondary font-bold text-xl">TZS 30,000</span>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-brand-primary text-brand-background font-title text-xl font-bold uppercase tracking-wider py-5 rounded hover:bg-brand-secondary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isProcessing ? (
                    <span className="w-5 h-5 border-2 border-brand-background border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>Pay TZS 30,000</span>
                  )}
                </button>
                <p className="text-center text-[10px] text-brand-primary/40 font-typewriter uppercase tracking-widest mt-6">
                  Secured via Mock Gateway
                </p>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
