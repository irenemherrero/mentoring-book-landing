import { APIContext } from "astro";

export const prerender = false;

export async function POST({ request }: APIContext) {
  const apiKey = import.meta.env.API_KEY;
  const groupId = import.meta.env.GROUP_ID;
  const targetUrl = import.meta.env.API_URL;

  if (!apiKey || !groupId || !targetUrl) {
    return new Response("Missing environment variables", { status: 500 });
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return new Response("Email is required", { status: 400 });
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: email,
        groups: [groupId],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API request failed:", errorText);
      return new Response(errorText, { status: response.status });
    }

    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}