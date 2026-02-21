export default {
  async fetch(request: Request, env: any) {
    // Get your secret API key from Cloudflare
    const apiKey = env.RESEND_API_KEY;

    // Example: send a POST request to Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`, // <-- key goes here
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "you@example.com",
        to: ["friend@example.com"],
        subject: "Hello from Cloudflare Worker",
        html: "<p>This is a test email</p>",
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  },
};