import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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
  const speakers = [
    { 
      id: '1', 
      name: 'Anaya Rashid', 
      topic: 'The Culture of Time', 
      segmentId: 'past',
      bio: "Anaya Rashid explores the subjective nature of time and how cultural perspectives shape our perception of reality. Her talk delves into the tension between our desire for productivity and the intrinsic value of being present in the moment. Through a blend of personal reflection and cultural analysis, she invites us to reconsider how we experience the hours we are given."
    },
    { 
      id: '2', 
      name: 'Zahra Datoo', 
      topic: 'The Architecture of Nostalgia', 
      segmentId: 'past', 
      bio: "Zahra Datoo examines the emotional architecture of nostalgia and its role in defining our sense of self. She challenges us to reconsider how we value the transient moments of our lives and the legacy we build through presence, emphasizing that our most meaningful memories are often found in the simplest experiences."
    },
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

app.post('/api/register', async (req, res) => {
  const { email, name, message } = req.body;
  const resendKey = process.env.RESEND_API_KEY;
  
  if (resendKey) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendKey);
      // Send notification to Admin
      console.log('Attempting to send admin email via Resend...');
      try {
        const adminEmail = await resend.emails.send({
          from: 'TEDx Youth <onboarding@resend.dev>',
          to: ['jabari2breezy@gmail.com'],
          subject: `New Get Involved Request: ${name}`,
          html: `
            <div style="font-family: sans-serif; line-height: 1.5; color: #002B5B;">
              <h1 style="border-bottom: 2px solid #00A859; padding-bottom: 10px;">New Interest for TEDxAlMuntazirSchoolsYouth 2026</h1>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong> ${message || 'No message provided'}</p>
            </div>
          `
        });
        console.log('Admin notification response:', adminEmail);
        if (adminEmail.error) {
          console.error('Resend Admin Email Error:', JSON.stringify(adminEmail.error, null, 2));
        }
      } catch (err: any) {
        console.error('Admin email failed:', err.message || err);
      }

      // Send thank you email to User
      // NOTE: Resend's onboarding@resend.dev only allows sending to the account owner (you).
      // If the email is not yours, this WILL fail with a validation_error until you verify a domain.
      if (email.toLowerCase() === 'jabari2breezy@gmail.com' || process.env.NODE_ENV === 'production') {
        console.log('Attempting to send user thank you email via Resend to:', email);
        try {
          const userEmail = await resend.emails.send({
            from: 'TEDxAlMuntazir <onboarding@resend.dev>',
            to: [email],
            subject: `Thank you for your interest, ${name}!`,
            html: `
              <div style="font-family: sans-serif; line-height: 1.6; color: #002B5B; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 24px; padding: 40px;">
                <h1 style="font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; margin-bottom: 24px;">Borrowed Time / <span style="color: #00A859;">TEDx</span></h1>
                <p>Hello ${name},</p>
                <p>Thank you for reaching out to us. We've received your message and we're thrilled to see your interest in <strong>TEDxAlMuntazirSchoolsYouth 2026</strong>.</p>
                <p>Our theme this year is <em>"Borrowed Time"</em>, and we are working hard to curate an assembly that challenges the way we perceive and spend the moments we have.</p>
                <p>Our curation and logistics teams will review your request and get back to you as soon as possible.</p>
                <p style="margin-top: 40px; font-size: 14px; color: #002B5B; opacity: 0.6;">Stay tuned for more updates.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #00A859;">TEDxAlMuntazirSchoolsYouth Team</p>
              </div>
            `
          });
          console.log('User notification response:', userEmail);
          if (userEmail.error) {
            console.warn('Resend User Email Error (Likely due to unverified domain):', JSON.stringify(userEmail.error, null, 2));
          }
        } catch (err: any) {
          console.warn('User thank you email failed (Likely due to Resend restrictions):', err.message || err);
        }
      } else {
        console.log('Skipping user email because domain is not verified and recipeient is not the owner.');
      }
    } catch (error: any) {
      console.error('Catch Error sending email:', error.message || error);
    }
  } else {
    console.warn('RESEND_API_KEY is missing. Skipping email sending.');
  }
  
  res.json({ 
    success: true, 
    message: 'Invitation request received. We will be in touch.' 
  });
});

const setupApp = async (app: any) => {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production or on Vercel, we serve static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // SPA Fallback for non-API routes
    app.get(/^(?!\/api).+/, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
};

// Start logic
if (!process.env.VERCEL) {
  // On Cloud Run or local dev, we need to listen
  setupApp(app).then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
    });
  });
} else {
  // On Vercel, the handler is exported
  setupApp(app);
}

export default app;
