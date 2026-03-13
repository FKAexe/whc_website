import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distFolder = join(__dirname, 'dist/whc_website/browser');

const app = express();

app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, name, email, phone, projectType, message, honeypot } = req.body;

  if (honeypot) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!email || !message) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }

  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set.');
    res.status(500).json({ error: 'Server configuration error.' });
    return;
  }

  const senderName = firstName && lastName ? `${firstName} ${lastName}` : (name ?? email);
  const subject = `New Enquiry – ${projectType ?? 'Website Contact Form'}`;
  const fromAddress = process.env['RESEND_FROM_EMAIL'] ?? 'onboarding@resend.dev';

  const html = `
    <h2 style="font-family:sans-serif;">New enquiry from ${senderName}</h2>
    <p style="font-family:sans-serif;"><strong>Email:</strong> ${email}</p>
    ${phone ? `<p style="font-family:sans-serif;"><strong>Phone:</strong> ${phone}</p>` : ''}
    ${projectType ? `<p style="font-family:sans-serif;"><strong>Project type:</strong> ${projectType}</p>` : ''}
    <p style="font-family:sans-serif;"><strong>Message:</strong></p>
    <p style="font-family:sans-serif;">${message.replace(/\n/g, '<br>')}</p>
  `;

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: `Workhorse Crew <${fromAddress}>`,
      to: 'enquiries@workhorsecrew.co.uk',
      replyTo: email,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      res.status(500).json({ error: 'Failed to send message. Please try again.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact route error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Serve static Angular files
app.use(express.static(distFolder));

// SPA fallback — return index.html for all Angular routes
app.get('/{*path}', (_req, res) => {
  res.sendFile(join(distFolder, 'index.html'));
});

const port = process.env['PORT'] || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
