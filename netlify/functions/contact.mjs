import { Resend } from 'resend';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const { name, email, projectType, message, honeypot } = body;

  if (honeypot) {
    return json({ ok: true });
  }

  if (!email || !message) {
    return json({ error: 'Missing required fields.' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set.');
    return json({ error: 'Server configuration error.' }, 500);
  }

  const senderName = name ?? email;
  const subject = `New Enquiry – ${projectType ?? 'Website Contact Form'}`;
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

  const html = `
    <h2 style="font-family:sans-serif;">New enquiry from ${senderName}</h2>
    <p style="font-family:sans-serif;"><strong>Email:</strong> ${email}</p>
    ${projectType ? `<p style="font-family:sans-serif;"><strong>Project type:</strong> ${projectType}</p>` : ''}
    <p style="font-family:sans-serif;"><strong>Message:</strong></p>
    <p style="font-family:sans-serif;">${message.replace(/\n/g, '<br>')}</p>
  `;

  try {
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
      return json({ error: 'Failed to send message. Please try again.' }, 500);
    }

    return json({ ok: true });
  } catch (err) {
    console.error('Contact function error:', err);
    return json({ error: 'Failed to send message. Please try again.' }, 500);
  }
};

export const config = { path: '/api/contact' };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
