export interface Env {
  RESEND_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { email, subject, message } = await request.json();

      if (!email || !subject || !message) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Initialize Resend client (you may need to import this or call fetch directly)
      const apiKey = env.RESEND_API_KEY;

      // Call Resend API via fetch (example)
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: 'kevin45283@gmail.com',
          reply_to: email,
          subject,
          html: `
            <p><strong>From:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        }),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json();
        return new Response(JSON.stringify({ error: errorData.message || 'Failed to send' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await resendResponse.json();

      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};