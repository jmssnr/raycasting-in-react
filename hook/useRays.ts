import { useSceneContext } from "@/components/scene";
import { hash } from "node:crypto";

export const useRays = (
  renderer: (
    lineHeight: number,
    x: number,
    side: number,
    screenHeight: number
  ) => React.ReactNode
) => {
  const { position, direction, plane, screenWidth, screenHeight, sceneTiles } =
    useSceneContext();

  const elements: React.ReactNode[] = [];
  for (let x = 0; x < screenWidth; x++) {
    const cameraX = (2 * x) / screenWidth - 1;
    const rayDirection = direction.add(plane.multiply(cameraX));
    const deltaDistX =
      rayDirection.x == 0 ? 1e30 : Math.abs(1 / rayDirection.x);
    const deltaDistY =
      rayDirection.y == 0 ? 1e30 : Math.abs(1 / rayDirection.y);

    let stepX;
    let stepY;
    let hit = 0;
    let side = 1;
    let sideDistX;
    let sideDistY;
    let mapX = Math.floor(position.x);
    let mapY = Math.floor(position.y);
    let perpWallDist;
    if (rayDirection.x < 0) {
      stepX = -1;
      sideDistX = (position.x - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1.0 - position.x) * deltaDistX;
    }

    if (rayDirection.y < 0) {
      stepY = -1;
      sideDistY = (position.y - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1.0 - position.y) * deltaDistY;
    }

    while (hit === 0) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }
      //Check if ray has hit a wall
      if (sceneTiles[mapY][mapX] > 0) {
        hit = 1;
      }
    }
    if (side == 0) perpWallDist = sideDistX - deltaDistX;
    else perpWallDist = sideDistY - deltaDistY;
    const lineHeight = screenHeight / perpWallDist;

    const element = renderer(lineHeight, x, side, screenHeight);
    elements.push(element);
  }

  return elements;
};
