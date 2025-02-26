"use server";

export async function generateVideo(formData: FormData) {
  const externalApiUrl = `${process.env.API_URL}/upload`;

  const apiFormData = new FormData();

  const audioFile = formData.get("audio") as File;
  if (audioFile) {
    apiFormData.append("audio", audioFile, audioFile.name);
  }

  const imageUrls = formData.getAll("images") as string[];
  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i];

    const res = await fetch(imageUrl);
    if (!res.ok) {
      console.error(`Failed to fetch image from URL: ${imageUrl}`);
      continue;
    }

    const imageBuffer = await res.arrayBuffer();
    const imageBlob = new Blob([imageBuffer], { type: "image/png" });
    apiFormData.append("images", imageBlob, `image_${i}.png`);
  }

  const script = formData.get("script") as string;
  if (script) {
    apiFormData.append("script", script);
  }

  const apiRequestOptions = {
    method: "POST",
    body: apiFormData as any,
  };

  const response = await fetch(externalApiUrl, apiRequestOptions);

  if (!response.ok) {
    const res = await response.text();
    throw new Error("Failed to send data to the external API");
  }

  const result = await response.json();

  return `${process.env.API_URL}${result.videoUrl}`;
}
