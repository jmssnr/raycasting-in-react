import { useRays } from "@/hook/useRays";
import React from "react";
import { useSceneContext } from "./scene";

const DIVRenderer = (
  lineHeight: number,
  x: number,
  side: number,
  screenHeight: number
) => {
  return (
    <div className="flex flex-col h-full">
      <div
        className="
      bg-blue-500"
        style={{ width: 1, height: -lineHeight / 2 + screenHeight / 2 }}
      />
      <div
        style={{
          width: 1,
          height: lineHeight,
          backgroundColor: side === 1 ? "gray" : "lightGray",
        }}
      />
      <div
        className="flex-1 bg-green-700 h-full"
        style={{ width: 1, backgroundColor: "green" }}
      />
    </div>
  );
};

const DIVEngine = () => {
  const { screenWidth, screenHeight } = useSceneContext();
  const elements = useRays(DIVRenderer);

  return (
    <div
      className="flex border border-red-500"
      style={{ width: screenWidth, height: screenHeight }}
    >
      {elements}
    </div>
  );
};

export default DIVEngine;
