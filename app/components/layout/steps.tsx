"use client";

import React, { useContext } from "react";
import { Steps as AntdSteps } from "antd";
import { StepContext } from "../context/StepContextProvider";

const Steps: React.FC = () => {
  const { currentStep, steps } = useContext(StepContext);
  return (
    <div>
      <AntdSteps direction="vertical" current={currentStep} items={steps} />
    </div>
  );
};

export default Steps;
