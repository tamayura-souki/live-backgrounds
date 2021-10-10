import p5 from "p5";
import { Triangle } from "./triangle";

const subdivide = (triangles: Triangle[], ratio: number): Triangle[] => {
  const subdividedTriangles:Triangle[] = [];
  triangles.forEach(tri => {
    if (tri.isColor2) {
      const P = tri.v2.copy().add(tri.v1.copy().sub(tri.v2).div(ratio));
      const Q = tri.v2.copy().add(tri.v3.copy().sub(tri.v2).div(ratio));
      subdividedTriangles.push({
        isColor2: true, v1: Q, v2: tri.v3, v3: tri.v1
      });
      subdividedTriangles.push({
        isColor2: true, v1: P, v2: Q, v3: tri.v2
      });
      subdividedTriangles.push({
        isColor2: false, v1: Q, v2: P, v3: tri.v1
      });

    } else {
      const R = tri.v1.copy().add(tri.v2.copy().sub(tri.v1).div(ratio));
      subdividedTriangles.push({
        isColor2: false, v1: tri.v3, v2: R, v3: tri.v2
      });
      subdividedTriangles.push({
        isColor2: true, v1: R, v2: tri.v3, v3: tri.v1
      });
    }
  });

  return subdividedTriangles;
}

const makeInitTriangle = (p: p5, i: number, n: number, radius: number): Triangle => {
  const v1 = p.createVector(0, 0);
  const v2Ang = (2*i-1) * p.PI / n;
  const v2 = p.createVector(p.cos(v2Ang), p.sin(v2Ang)).mult(radius);
  const v3Ang = (2*i+1) * p.PI / n;
  const v3 = p.createVector(p.cos(v3Ang), p.sin(v3Ang)).mult(radius);
  if (i % 2 == 0) {
    return {isColor2: false, v1: v1, v2: v3, v3: v2};
  } else {
    return {isColor2: false, v1: v1, v2: v2, v3: v3};
  }
}

export const makeTriangles = (
  p: p5,
  subdivisionsN: number,
  triangleN: number,
  ratio: number,
  radius: number
): Triangle[] => {
  const makeTri = (i: number) => makeInitTriangle(p, i, triangleN, radius);
  let triangles = Array.from(Array(triangleN), (v, i) => i).map((v) => makeTri(v));
  for (let i = 0; i < subdivisionsN; i++) {
    triangles = subdivide(triangles, ratio);
  }
  return triangles;
}