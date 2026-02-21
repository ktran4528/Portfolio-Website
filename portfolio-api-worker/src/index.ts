export default {
  async fetch(request: Request, env: any) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const { email, subject, message } = await request.json();

      if (!email || !subject || !message) {
        return new Response("Missing required fields", { status: 400 });
      }

      const apiKey = env.RESEND_API_KEY;

      const apiResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: "kevin45283@gmail.com",
          reply_to: email,
          subject,
          html: message.replace(/\n/g, "<br>"),
        }),
      });

      if (!apiResponse.ok) {
        const text = await apiResponse.text();
        return new Response(`Failed to send email: ${text}`, {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }

      return new Response("Email sent successfully!", {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      });

    } catch (e) {
      return new Response("Invalid request", {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};