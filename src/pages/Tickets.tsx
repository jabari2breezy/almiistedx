import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Tickets() {
  const [ticketsLeft] = useState(100); // Mock inventory

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
          className="space-y-16"
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
                  <p>✓ Digital & Physical Certificate</p>
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
                  <div className="px-4 py-2 border border-brand-outline rounded bg-brand-surface text-xs font-bold">Airtel Money</div>
                  <div className="px-4 py-2 border border-brand-outline rounded bg-brand-surface text-xs font-bold">HaloPesa</div>
                  <div className="px-4 py-2 border border-brand-outline rounded bg-brand-surface text-xs font-bold">Cards (Mastercard)</div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-brand-surface p-8 md:p-12 border border-brand-outline rounded-sm flex flex-col justify-center text-center">
              <h2 className="text-3xl font-title font-black uppercase tracking-tighter mb-4">Ready to Join Us?</h2>
              <p className="text-brand-primary/60 font-editorial text-lg mb-12">
                Click below to proceed to our secure checkout gateway and generate your official digital ticket.
              </p>
              <Link 
                to="/checkout"
                className="w-full bg-brand-primary text-brand-background font-title text-xl font-bold uppercase tracking-wider py-5 rounded hover:bg-brand-secondary hover:text-white transition-all inline-block"
              >
                Proceed to Checkout
              </Link>
              <p className="text-center text-[10px] text-brand-primary/40 font-typewriter uppercase tracking-widest mt-6">
                Students Only
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
