import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import FloatingCursor from './components/FloatingCursor';
import InteractiveBackground from './components/InteractiveBackground';
import CurtainTransition from './components/CurtainTransition';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';
import Theme from './pages/Theme';
import SpeakersPage from './pages/Speakers';
import About from './pages/About';
import Agenda from './pages/Agenda';
import FAQ from './pages/FAQ';
import Tickets from './pages/Tickets';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import { useEffect } from 'react';
import Lenis from 'lenis';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/theme" element={<Theme />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <div className="relative selection:bg-brand-secondary selection:text-white min-h-screen flex flex-col">
          <InteractiveBackground />
          <CurtainTransition />
          <FloatingCursor />
          <ScrollToTop />
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
          
          {/* Oryzo-style scanline overlay */}
          <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
          <ScrollToTopButton />
        </div>
    </Router>
  );
}
