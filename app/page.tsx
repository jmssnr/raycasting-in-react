"use client";

import Scene from "@/components/scene";
import SVGEngine from "@/components/svg-engine";

export default function Home() {
  return (
    <div className="w-screen h-screen grid place-content-center">
      <Scene width={1024} height={640}>
        <SVGEngine />
      </Scene>
    </div>
  );
}
