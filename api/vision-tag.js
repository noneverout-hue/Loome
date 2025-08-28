// api/vision-tag.js  (Vercel Serverless Function - Framework "Other")
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { image_url } = body || {};
    if (!image_url) return res.status(400).json({ error: "image_url is required" });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analizza l'immagine e restituisci solo JSON: {type, color, brand, season}." },
            { type: "image_url", image_url }
          ]
        }
      ],
      temperature: 0.2
    });

    let raw = chat.choices?.[0]?.message?.content?.trim() ?? "{}";
    let tags; try { tags = JSON.parse(raw); } catch { tags = { raw }; }

    return res.status(200).json({ tags });
  } catch (err) {
    return res.status(500).json({ error: "Vision API error", details: String(err) });
  }
}
