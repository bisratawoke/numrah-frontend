"use client";
import { Spin } from "antd";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <Spin fullscreen />
    </div>
  );
}
