import p5 from "p5";

export type Triangle = {
  isColor2: boolean,
  v1: p5.Vector,
  v2: p5.Vector,
  v3: p5.Vector,
}

export const drawTriangle = (p: p5, tri: Triangle) => {
  p.triangle(tri.v1.x, tri.v1.y, tri.v2.x, tri.v2.y, tri.v3.x, tri.v3.y);
}

export const drawPartialOutline = (p: p5, tri: Triangle) => {
  p.line(tri.v3.x, tri.v3.y, tri.v1.x, tri.v1.y);
  p.line(tri.v1.x, tri.v1.y, tri.v2.x, tri.v2.y);
}
