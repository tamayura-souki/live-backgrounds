import { FPS } from "./constants";

export const frameToEaseX = (
  frameCount: number, period: number
  ): number => {
  let x = frameCount/FPS/period;
  if (x > 1.0) x = 1.0;
  if (x < 0.0) x = 0.0;
  return x;
}

export const easeInOutBack = (x: number): number => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;

  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}