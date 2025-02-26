"use client";

import { createContext, useState } from "react";

export const StepContext = createContext<any>(null);

export default function StepContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [steps, setSteps] = useState<any>([
    {
      key: "Script generation",
      title: "Script generation",
    },
    {
      key: "Audio generation",
      title: "Audio generation",
    },
    {
      key: "Image generation",
      title: "Image generation",
    },
    {
      key: "Video generation",
      title: "Video generation",
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);

  const [selectedScript, setSelectedScript] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState([]);
  const next = () => {
    setCurrentStep((current) => current + 1);
  };

  const prev = () => {
    setCurrentStep((current) => current - 1);
  };

  const resetAllData = () => {
    setCurrentStep(0);
    setSelectedScript([]);
    setSelectedVoice([]);
  };
  return (
    <StepContext.Provider
      value={{
        steps,
        setSteps,
        currentStep,
        setCurrentStep,
        next,
        prev,
        selectedScript,
        setSelectedScript,
        images,
        setImages,
        selectedVoice,
        setSelectedVoice,
        resetAllData,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}
