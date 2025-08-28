// app/api/vision-tag/route.js
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
const { image_url } = await req.json();
    if (!image_url) {
      return NextResponse.json({ error: "image_url is required" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini", // puoi sostituire con GPT-5 Vision appena attivo
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analizza l'immagine e restituisci JSON: {type, color, brand, season}." },
            { type: "image_url", image_url }
          ]
        }
      ],
      temperature: 0.2
    });

    let raw = chat.choices?.[0]?.message?.content?.trim() ?? "{}";
    let tags;
    try { tags = JSON.parse(raw); } catch { tags = { raw }; }

    return NextResponse.json({ tags }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Vision API error", details: String(err) }, { status: 500 });
  }
}
Add vision-tag endpoint
