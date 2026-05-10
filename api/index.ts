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
    { 
      id: '6', 
      name: 'Sada Mbaruk Said', 
      topic: 'Three Clocks: Climate, Animals, AI', 
      segmentId: 'future',
      bio: "Sada explores the concept of 'slow destruction,' challenging the notion of a sudden global catastrophe in favor of a more insidious reality: the gradual unraveling of our world through the small, everyday choices we often ignore. By examining the interconnected chain of conflict, societal collapse, and environmental decay, she reveals how seemingly isolated issues feed into a larger systemic crisis. Her talk serves as a powerful reminder that the true danger lies not in a single disaster, but in the millions of moments where we choose not to care, urging us to recognize our collective responsibility before the damage becomes irreversible."
    }
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
        const { data, error } = await resend.emails.send({
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
        
        if (error) {
          console.warn('Resend Admin Notification issue:', error.message);
        } else {
          console.log('Admin notification sent successfully:', data?.id);
        }
      } catch (err: any) {
        console.error('Admin email failed:', err.message || err);
      }
    } catch (err: any) {
      console.error('Resend Setup Error:', err.message || err);
    }
  } else {
    console.warn('RESEND_API_KEY is missing. Skipping admin notification.');
  }

  // --- Mailchimp Integration ---
  const mailchimpKey = process.env.MAILCHIMP_API_KEY;
  const mailchimpAudienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const mailchimpServer = process.env.MAILCHIMP_SERVER_PREFIX;

  if (mailchimpKey && mailchimpAudienceId && mailchimpServer) {
    try {
      const mailchimp = (await import('@mailchimp/mailchimp_marketing')).default;
      mailchimp.setConfig({
        apiKey: mailchimpKey,
        server: mailchimpServer,
      });

      console.log(`Subscribing ${email} to Mailchimp...`);
      try {
        await mailchimp.lists.addListMember(mailchimpAudienceId, {
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: name.split(' ')[0] || '',
            LNAME: name.split(' ').slice(1).join(' ') || '',
          },
        });
        console.log('User successfully subscribed to Mailchimp');
      } catch (mcError: any) {
        const body = mcError.response?.body;
        if (body?.title === 'Member Exists') {
          console.log('User is already in the Mailchimp list.');
        } else {
          console.warn('Mailchimp API Warning:', body?.detail || mcError.message);
        }
      }
    } catch (err: any) {
      console.error('Mailchimp Setup Error:', err.message || err);
    }
  } else {
    console.warn('Mailchimp credentials missing. Skipping subscription.');
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
