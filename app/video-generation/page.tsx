"use client";
import { useEffect, useContext, useState, useRef } from "react";
import { StepContext } from "../components/context/StepContextProvider";
import { useRouter } from "next/navigation";
import { generateVideo } from "../actions/generate-video";
import Spinner from "../components/ui/Spinner";

export default function VideoGenerationPage() {
  const { setCurrentStep, prev, images, selectedVoice, resetAllData } =
    useContext(StepContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<any[]>([]);
  const effectRan = useRef(false);
  const handleSaveVideo = async () => {
    if (
      !selectedVoice.length ||
      !selectedVoice[0].sampleUrl ||
      images.length === 0
    ) {
      console.error("Missing voice or images!");
      return;
    }

    const visted: any = [];
    for (let vi of selectedVoice) {
      if (vi.sampleUrl in visted) {
        continue;
      }
      visted.push(vi.sampleUrl);
      const formData = new FormData();
      const audioBlob = await fetch(vi.sampleUrl).then((res) => res.blob());
      formData.append("audio", audioBlob, `${vi.name}-audio.mp3`);
      images.forEach((image: any) => {
        formData.append("images", image);
      });
      formData.append("script", vi.script);

      setLoading(true);

      try {
        const videoUrl = await generateVideo(formData);
        setVideoUrl((state) => [...state, videoUrl]);
      } catch (error) {
        console.error("Error saving video:", error);
      } finally {
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    setCurrentStep(3);
    handleSaveVideo();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 ">Video Generation</h1>
      <p className="mb-6">
        Generate a video by combining your selected script, image, and audio
        from the previous page. Customize the final output with optional text
        overlays and seamlessly merge visuals with sound.
      </p>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h2>Generated Video:</h2>
          <div className="grid grid-cols-2 gap-2">
            {videoUrl.map((url) => (
              <>
                <video
                  controls
                  width="600"
                  src={`${url}`}
                  className="mt-2"
                ></video>
              </>
            ))}
          </div>
        </>
      )}

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => {
            prev();
            router.push("/image-generation");
          }}
          className="rounded bg-gray-500 text-white p-2"
        >
          Previous
        </button>
        <button
          onClick={() => {
            resetAllData();
            router.push("/script-generation");
          }}
          className="rounded bg-green-500 text-white p-2"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
