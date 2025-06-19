"use client";

import Scene from "@/components/scene";
import SVGEngine from "@/components/svg-engine";
import { ParentSize } from "@visx/responsive";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <ParentSize>
        {({ width, height }) => {
          if (width === 0 || height === 0) return;
          return (
            <Scene width={width} height={height}>
              <SVGEngine />
            </Scene>
          );
        }}
      </ParentSize>
    </div>
  );
}
