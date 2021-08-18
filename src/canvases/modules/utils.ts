import p5 from "p5";
import { FPS } from "./constants";

export type Point = {
  x: number,
  y: number
}

export type Color = {
  color?: number,
  r: number,
  g: number,
  b: number
}
export const isColor = (arg: any): arg is Color => {
  return arg.color !== undefined;
}

export type ParamGUIs = {
  [key: string]: p5.Element;
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

export const buildGUIs = (p5: p5, params: Object): ParamGUIs => {
  let paramGUIs: ParamGUIs = {};
  Object.entries(params).forEach(([key, value], i) => {
    if (typeof value === 'number') {
      let slider = p5.createSlider(0, 50, value);
      slider.position(10, 30*i+10);
      paramGUIs[key] = slider;
    }else if (isColor(value)) {
    }
  });
  return paramGUIs;
}