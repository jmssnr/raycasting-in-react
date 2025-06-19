"use client";

import { useSceneContext } from "./scene";
import { useRays } from "@/hook/useRays";
import { Group } from "@visx/group";

export const SVGRenderer = (
  lineHeight: number,
  x: number,
  side: number,
  screenHeight: number
) => {
  return (
    <Group>
      <rect
        width={1}
        height={lineHeight}
        x={x}
        y={-lineHeight / 2 + screenHeight / 2}
        fill={side === 1 ? "gray" : "lightGray"}
      />
      <rect
        width={1}
        x={x}
        y={0}
        fillOpacity={0.7}
        height={-lineHeight / 2 + screenHeight / 2}
        fill="blue"
      />
    </Group>
  );
};

const SVGEngine = () => {
  const { screenWidth, screenHeight } = useSceneContext();
  const elements = useRays(SVGRenderer);
  return (
    <svg width={screenWidth} height={screenHeight}>
      <rect
        width={screenWidth}
        height={screenHeight}
        className="fill-green-700"
      />
      {elements}
    </svg>
  );
};

export default SVGEngine;
