"use client";
import { useState, useEffect, useContext } from "react";
import { List, Checkbox, Spin } from "antd";
import { StepContext } from "../components/context/StepContextProvider";
import { useRouter } from "next/navigation";
import { getVoiceActors } from "../actions/get-voice-actors";
import Spinner from "../components/ui/Spinner";

interface VoiceActor {
  id: string;
  name: string;
  audioData: string;
  sampleUrl?: string;
  script?: string;
}

export default function AudioGenerationPage() {
  const { setCurrentStep, prev, next, selectedScript, setSelectedVoice } =
    useContext(StepContext);
  const router = useRouter();

  const [voiceActors, setVoiceActors] = useState<VoiceActor[]>([]);
  const [selectedVoiceActors, setSelectedVoiceActors] = useState<
    Record<string, string[]>
  >({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentStep(1);

    async function fetchAllVoiceActors() {
      setLoading(true);
      try {
        const voicesArray = await Promise.all(
          selectedScript.map((script: string) => getVoiceActors(script))
        );

        const uniqueVoices = voicesArray.flat().map((voice) => {
          const binaryString = atob(voice.audioData);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "audio/mpeg" });
          return { ...voice, sampleUrl: URL.createObjectURL(blob) };
        });

        const voiceMap = new Map();
        uniqueVoices.forEach((voice) => {
          const key = `${voice.script}-${voice.id}`;
          if (!voiceMap.has(key)) {
            voiceMap.set(key, voice);
          }
        });

        setVoiceActors(Array.from(voiceMap.values()));
      } catch (error) {
        console.error("Error fetching voice actors:", error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedScript.length > 0) {
      fetchAllVoiceActors();
    }

    return () => {
      voiceActors.forEach((voice) => {
        if (voice.sampleUrl) {
          URL.revokeObjectURL(voice.sampleUrl);
        }
      });
    };
  }, [setCurrentStep, selectedScript]);

  const toggleSelection = (script: string, id: string) => {
    setSelectedVoiceActors((prev) => {
      const updatedSelection = { ...prev };
      if (!updatedSelection[script]) {
        updatedSelection[script] = [];
      }
      updatedSelection[script].push(id);
      return updatedSelection;
    });

    const selectedVoice = voiceActors.find(
      (voice) => voice.id === id && voice.script === script
    );
    if (selectedVoice) {
      setSelectedVoice((state: any) => [...state, selectedVoice]);
    }
  };

  const handleNext = () => {
    if (
      Object.values(selectedVoiceActors).some(
        (selectedVoices) => selectedVoices.length > 0
      )
    ) {
      next();
      router.push("/image-generation");
    }
  };

  const groupedVoiceActors = voiceActors.reduce((acc, voice) => {
    const scriptKey = voice.script || "Uncategorized";
    if (!acc[scriptKey]) acc[scriptKey] = [];
    acc[scriptKey].push(voice);
    return acc;
  }, {} as Record<string, VoiceActor[]>);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Voice Actor Selection</h1>
      <p className="mb-6">
        Select one or more voice actors to narrate your video. Each selected
        script will be narrated by each chosen voice actor.
      </p>

      {loading ? (
        <Spinner />
      ) : (
        Object.entries(groupedVoiceActors).map(([script, voices]) => (
          <div key={script} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{script}</h2>
            <List
              bordered
              dataSource={voices}
              renderItem={(voice: VoiceActor) => (
                <List.Item
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => toggleSelection(script, voice.id)}
                >
                  <Checkbox
                    checked={selectedVoiceActors[script]?.includes(voice.id)}
                  />
                  <div className="flex-1">
                    <strong>{voice.name}</strong>
                  </div>
                  {voice.sampleUrl && (
                    <audio controls src={voice.sampleUrl} className="w-40" />
                  )}
                </List.Item>
              )}
            />
          </div>
        ))
      )}

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => {
            prev();
            router.push("/script-generation");
          }}
          className="rounded bg-gray-500 p-2"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={
            !Object.values(selectedVoiceActors).some(
              (selectedVoices) => selectedVoices.length > 0
            )
          }
          className={`rounded bg-blue-500 p-2 ${
            Object.values(selectedVoiceActors).some(
              (selectedVoices) => selectedVoices.length > 0
            )
              ? ""
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
