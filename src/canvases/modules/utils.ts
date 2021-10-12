import p5 from "p5";
import { FPS } from "./constants";

export type Point = {
  x: number,
  y: number
}

export const distance = (p: p5, a: Point, b: Point): number => {
  return p.sqrt((a.x-b.x)**2 + (a.y-b.y)**2)
}

export const isNear = (r: number, a: Point, b: Point): boolean => {
  return ((a.x-b.x)**2 + (a.y-b.y)**2 < r**2);
}

export const parseBool = (s: string): boolean => {
  if (!s) return false;
  s = s.toLowerCase();
  switch(s) {
  case "true": return true;
  case "false": return false;
  }
  return false;
}

export const mod = (i: number, j: number): number => {
  return (i % j) < 0 ? (i % j) + 0 + (j < 0 ? -j : j) : (i % j + 0);
}

export const frameToSecond = (frame: number): number => frame/FPS;

export const nGon = (
  p5: p5,
  n: number, pos: Point, r: number, deg: number = 0) => {

  deg = p5.TWO_PI * deg / 360;

  p5.push();
  p5.translate(pos.x, pos.y);
  p5.beginShape();
  for(let i=0; i<n; i++) {
    let angle = p5.TWO_PI / n * i + deg;
    let px = p5.sin(angle) * r;
    let py = p5.cos(angle) * r;
    p5.vertex(px, py, 0);
  }
  p5.endShape(p5.CLOSE);
  p5.pop();
}