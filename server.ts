import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/speakers', (req, res) => {
  // In a real app, this would come from a database like Firebase
  const speakers = [
    { id: '1', name: 'Anaya Rashid', topic: 'The Culture of Time', segmentId: 'past' },
    { id: '2', name: 'Zahra Datoo', topic: 'The Architecture of Nostalgia', segmentId: 'past' },
    { id: '3', name: 'Hassan Abbas Mohammed', topic: 'The Procrastination Paradox', segmentId: 'present' },
    { id: '4', name: 'Zahra Moledina', topic: "Capitalism's Clock", segmentId: 'present' },
    { id: '5', name: 'Liyaan Karbelkar', topic: 'The Legacy We Leave', segmentId: 'future' },
    { id: '6', name: 'Sada Mbaruk Said', topic: 'Three Clocks: Climate, Animals, AI', segmentId: 'future' }
  ];
  res.json(speakers);
});

app.get('/api/event-status', (req, res) => {
  const eventDate = new Date('2026-06-15T09:00:00Z');
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  
  res.json({
    status: diff > 0 ? 'upcoming' : 'live',
    eventDate: eventDate.toISOString(),
    daysRemaining: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
    secondsRemaining: Math.max(0, Math.floor(diff / 1000))
  });
});

app.get('/api/updates', (req, res) => {
  const updates = [
    { 
      id: '1', 
      title: 'Speaker List Finalized', 
      date: '2026-05-05', 
      content: 'The final assembly for "Borrowed Time" has been confirmed.' 
    },
    { 
      id: '2', 
      title: 'Partnering with Al Muntazir Schools', 
      date: '2026-04-28', 
      content: 'We are proud to host this year at the main assembly hall.' 
    }
  ];
  res.json(updates);
});

app.get('/api/quote', (req, res) => {
  const quotes = [
    { text: "Yesterday is but today's memory, and tomorrow is today's dream.", author: "Kahlil Gibran" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The two most powerful warriors are patience and time.", author: "Leo Tolstoy" },
    { text: "Time is a created thing. To say 'I don't have time,' is like saying, 'I don't want to.'", author: "Lao Tzu" },
    { text: "Lost time is never found again.", author: "Benjamin Franklin" }
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json(randomQuote);
});

app.get('/api/tickets', (req, res) => {
  res.json({
    remaining: 42,
    total: 300,
    status: 'Limited'
  });
});

app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  console.log(`NEW SUBSCRIPTION: ${email}`);
  // In real app, save to DB or Mailchimp
  res.json({ success: true, message: "Welcome to the inner circle." });
});

app.get('/api/schedule', (req, res) => {
  const schedule = [
    { time: '09:00', event: 'Doors Open & Registration', type: 'logistics' },
    { time: '10:00', event: 'Opening: The Clock Starts', type: 'session' },
    { time: '10:30', event: 'Segment I: The Ghost of the Past', type: 'session' },
    { time: '12:00', event: 'Break: Stillness', type: 'logistics' },
    { time: '13:00', event: 'Segment II: The Weight of Now', type: 'session' },
    { time: '14:30', event: 'Segment III: The Horizon of Future', type: 'session' },
    { time: '16:00', event: 'Closing: Borrowed Time is Ours', type: 'session' }
  ];
  res.json(schedule);
});

app.post('/api/time-capsule', (req, res) => {
  const { message, category } = req.body;
  console.log(`TIME CAPSULE ENTRY [${category}]: ${message}`);
  res.json({ success: true, message: "Your message has been frozen in time." });
});

// Example registration/contact endpoint
app.post('/api/register', async (req, res) => {
  const { email, name, message } = req.body;
  console.log('--- NEW GET INVOLVED REQUEST ---');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  if (message) console.log(`Message: ${message}`);
  console.log('--------------------------------');

  const resendKey = process.env.RESEND_API_KEY;
  
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'TEDx Youth <onboarding@resend.dev>',
        to: ['jabari2breezy@gmail.com'], // The user's email from metadata
        subject: `New Get Involved Request: ${name}`,
        html: `
          <h1>New Interest for TEDxAlMuntazirSchoolsYouth 2026</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message || 'No message provided'}</p>
        `
      });
      console.log('Email sent successfully via Resend');
    } catch (error) {
      console.error('Error sending email via Resend:', error);
    }
  } else {
    console.log('Skipping email sending: RESEND_API_KEY not found in environment');
  }
  
  res.json({ 
    success: true, 
    message: 'Invitation request received. We will be in touch.' 
  });
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// Only listen if not in a Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  setupVite().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  });
} else {
  // In production (Vercel), we just export the app
  setupVite();
}

export default app;
