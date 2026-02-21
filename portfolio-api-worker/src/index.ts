// src/index.ts
export default {
  async fetch(request, env) {
    // Only accept POST requests
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      // Parse the JSON body from the frontend
      const { email, subject, message } = await request.json();

      // Check for missing fields
      if (!email || !subject || !message) {
        return new Response("Missing required fields", { status: 400 });
      }

      // Your secret API key stored as a Cloudflare Worker secret
      const apiKey = env.RESEND_API_KEY;

      // Call the Resend API
      const apiResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev", // Replace with your sending email
          to: "kevin45283@gmail.com",    // Replace with your receiving email
          reply_to: email,
          subject,
          html: message.replace(/\n/g, "<br>"),
        }),
      });

      // Handle errors from the Resend API
      if (!apiResponse.ok) {
        const text = await apiResponse.text();
        return new Response(`Failed to send email: ${text}`, { status: 500 });
      }

      return new Response("Email sent successfully!", { status: 200 });
    } catch (e) {
      return new Response("Invalid request", { status: 400 });
    }
  },
};