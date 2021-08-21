import p5 from "p5";
import { FPS } from "./constants";

export type Point = {
  x: number,
  y: number
}

export type ParamNum = {
  val: number,
  min: number,
  max: number,
  isInt: boolean,
}
export const isParamNum = (arg: any): arg is ParamNum => {
  return (typeof arg.val === 'number')
    && (typeof arg.min === 'number') && (typeof arg.max === 'number')
    && (typeof arg.isInt === 'boolean');
}

export type Color = {
  r: number,
  g: number,
  b: number
}
export const isColor = (arg: any): arg is Color => {
  return (typeof arg.r === 'number') && (typeof arg.g === 'number')
    && (typeof arg.b === 'number');
}
export const codeToColor = (code: string): Color => {
  code = code.replace('#', '');
  code = code.toUpperCase();
  console.log(code);
  const c: Color = {
    r: parseInt(code[0]+code[1], 16),
    g: parseInt(code[2]+code[3], 16),
    b: parseInt(code[4]+code[5], 16)
  }
  console.log(c);
  return c;
}

export type ParamGUIs = {
  [key: string]: p5.Element;
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

export const buildGUIs = (p5: p5, params: Object): ParamGUIs => {
  let paramGUIs: ParamGUIs = {};
  Object.entries(params).forEach(([key, value], i) => {
    if (isParamNum(value)) {
      let slider = p5.createSlider(
        value.min, value.max, value.val,
        value.isInt ? 1 : 0
      );
      slider.position(10, 30*i+10);
      paramGUIs[key] = slider;
    }else if (isColor(value)) {
      let colorPicker = p5.createColorPicker(
        p5.color(value.r, value.g, value.b)
      );
      colorPicker.position(10, 30*i+10);
      paramGUIs[key] = colorPicker;
    }
  });
  return paramGUIs;
}

export const updateGUIs = (params: Object, paramGUIs: ParamGUIs) => {
  Object.entries(params).forEach(([key, value]) => {
    if (isParamNum(value)) {
      params[key].val = paramGUIs[key].value();
    }else if (isColor(value)) {
      let code: string = paramGUIs[key].value().toString();
      params[key] = codeToColor(code);
    }
  });
}