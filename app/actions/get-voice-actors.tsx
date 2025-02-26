"use server";

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getVoiceActors(
  script: string
): Promise<{ id: string; name: string; audioData: string; script: string }[]> {
  try {
    const availableVoices: any = [
      { id: "alloy", name: "Alloy" },
      { id: "ash", name: "Ash" },
      { id: "coral", name: "Coral" },
      { id: "echo", name: "Echo" },
      { id: "fable", name: "Fable" },
      { id: "onyx", name: "Onyx" },
      { id: "nova", name: "Nova" },
      { id: "sage", name: "Sage" },
      { id: "shimmer", name: "Shimmer" },
    ];

    const selectedVoices = availableVoices.slice(0, 2);
    const voiceActors = [];

    for (const voice of selectedVoices) {
      console.log(`🔹 Generating speech for ${voice.name}...`);

      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice.id,
        input: script,
      });

      const base64Audio = Buffer.from(await mp3.arrayBuffer()).toString(
        "base64"
      );

      voiceActors.push({
        id: voice.id,
        name: voice.name,
        audioData: base64Audio,
        script: `${script}`,
      });
    }

    return voiceActors;
  } catch (error) {
    return [];
  }
}
