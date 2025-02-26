"use server";

import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateScripts(
  query: string,
  count: number
): Promise<string[]> {
  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: ` IMPORTANT: Dont enumerate,Dont start sentense with a number , Output only the raw script text without any additional words, headings, numbering, or labels. Do not include any text like "Script 1:" or "1." or any similar indicator. The output should begin immediately with the content of the monologue. Generate ${count} distinct monologue scripts for the query: "${query}". Each script should be a continuous narration by a single speaker.`,
      max_tokens: 150,
      n: count,
      temperature: 0.1,
    });

    return response.choices.map((choice) => choice.text.trim().split(":")[1]);
    // return response.choices.map((choice) => {
    //   const current = choice.text.trim().split(":")[1];
    //   return current;
    // });
  } catch (error) {
    console.error("Error generating scripts from OpenAI:", error);
    return [];
  }
}
