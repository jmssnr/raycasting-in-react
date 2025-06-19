"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(that: Vector) {
    return new Vector(this.x + that.x, this.y + that.y);
  }

  subtract(that: Vector) {
    return new Vector(this.x - that.x, this.y - that.y);
  }

  multiply(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  rotate(sign: number) {
    const rotationSpeed = 0.005;

    return new Vector(
      Math.cos(sign * rotationSpeed) * this.x -
        Math.sin(sign * rotationSpeed) * this.y,
      Math.sin(sign * rotationSpeed) * this.x +
        Math.cos(sign * rotationSpeed) * this.y
    );
  }
}

const sceneTiles = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

type SceneContextType = {
  position: Vector;
  direction: Vector;
  plane: Vector;
  screenWidth: number;
  screenHeight: number;
  sceneTiles: number[][];
};

const SceneContext = createContext<SceneContextType | null>(null);

export const useSceneContext = () => {
  const context = useContext(SceneContext);

  if (!context) {
    throw Error("No provider in tree");
  }

  return context;
};

const canStep = (position: Vector) => {
  const x = Math.ceil(position.x);
  const y = Math.ceil(position.y);
  return sceneTiles[y - 1][x - 1] === 0;
};

const Scene = (props: {
  width: number;
  height: number;
  children: React.ReactNode;
}) => {
  const { width, height, children } = props;
  const [position, setPosition] = useState({ x: 7, y: 8 });
  const [direction, setDirection] = useState({ x: -1, y: 0 });
  const [plane, setPlane] = useState({ x: 0, y: 0.66 });

  const positionVector = new Vector(position.x, position.y);
  const directionVector = new Vector(direction.x, direction.y);
  const planeVector = new Vector(plane.x, plane.y);

  const stepSize = 0.5;

  useHotkeys("w, a, s, d", (event, handler) => {
    const nextPointVector = positionVector.add(
      directionVector.multiply(stepSize)
    );

    const keys = !handler.keys ? [event.key] : handler.keys;
    if (keys.includes("w")) {
      if (canStep(nextPointVector)) {
        setPosition({ x: nextPointVector.x, y: nextPointVector.y });
      }
    }

    if (keys.includes("s")) {
      const nextPointVector = positionVector.subtract(
        directionVector.multiply(stepSize)
      );
      if (canStep(nextPointVector)) {
        setPosition({ x: nextPointVector.x, y: nextPointVector.y });
      }
    }

    if (keys.includes("d")) {
      const nextPointVector = positionVector.add(
        planeVector.multiply(stepSize)
      );
      if (canStep(nextPointVector)) {
        setPosition({ x: nextPointVector.x, y: nextPointVector.y });
      }
    }

    if (keys.includes("a")) {
      const nextPointVector = positionVector.subtract(
        planeVector.multiply(stepSize)
      );
      if (canStep(nextPointVector)) {
        setPosition({ x: nextPointVector.x, y: nextPointVector.y });
      }
    }
  });

  const value = useMemo(
    () => ({
      position: positionVector,
      direction: directionVector,
      plane: planeVector,
      screenWidth: width,
      screenHeight: height,
      sceneTiles,
    }),
    [position, direction, plane, width, height, sceneTiles]
  );
  console.log("Something");
  return (
    <SceneContext.Provider value={value}>
      <div
        onMouseMove={(event) => {
          const rot = -event.movementX;
          const nextPointVector = directionVector.rotate(rot);
          const nextPlaneVector = new Vector(plane.x, plane.y).rotate(rot);
          setDirection({ x: nextPointVector.x, y: nextPointVector.y });
          setPlane({ x: nextPlaneVector.x, y: nextPlaneVector.y });
        }}
      >
        {children}
      </div>
    </SceneContext.Provider>
  );
};

export default Scene;
