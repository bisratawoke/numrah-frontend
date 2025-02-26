"use server";

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateStyledImages(formData: FormData): Promise<any[]> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file uploaded.");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const convertedImage = await sharp(fileBuffer)
      .ensureAlpha()
      .toFormat("png")
      .toBuffer();

    const { width, height } = await sharp(fileBuffer).metadata();

    const maskImage = await sharp(fileBuffer)
      .greyscale()
      .threshold(200, { grayscale: true })
      .toColourspace("b-w")
      .toFormat("png")
      .resize(width, height)
      .toBuffer();

    const tempPath = path.join("./", `converted-${Date.now()}.png`);
    const tempMaskPath = path.join("./", `mask-${Date.now()}.png`);

    fs.writeFileSync(tempPath, convertedImage);
    fs.writeFileSync(tempMaskPath, maskImage);

    const basePrompt = formData.get("prompt") as string;
    const enhancedPrompt = `${basePrompt}. 
Ultra-HD, 4K resolution, highly detailed textures, sharp focus, cinematic lighting, 
photo-realistic quality, professional studio lighting, intricate details, smooth transitions.`;

    const response = await openai.images.edit({
      // model: "dall-e-3",
      image: fs.createReadStream(tempPath),
      mask: fs.createReadStream(tempMaskPath),
      prompt: enhancedPrompt,
      n: parseInt(formData.get("styleCount") as string) || 1,
      size: "1024x1024",
    });

    fs.unlinkSync(tempPath);
    fs.unlinkSync(tempMaskPath);

    return response.data.map((img) => img.url);
  } catch (error) {
    console.error("Error generating styled images:", error);
    return [];
  }
}
