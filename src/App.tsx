import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import FloatingCursor from './components/FloatingCursor';
import InteractiveBackground from './components/InteractiveBackground';
import Home from './pages/Home';
import Theme from './pages/Theme';
import SpeakersPage from './pages/Speakers';
import About from './pages/About';
import Footer from './components/Footer';
import { useEffect } from 'react';

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
      <motion.div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/theme" element={<Theme />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="relative selection:bg-brand-secondary selection:text-white min-h-screen flex flex-col">
        <InteractiveBackground />
        <FloatingCursor />
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
        
        {/* Oryzo-style scanline overlay */}
        <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>
    </Router>
  );
}
