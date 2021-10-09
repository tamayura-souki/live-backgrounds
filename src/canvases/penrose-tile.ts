import p5 from "p5";
import { FPS } from "./modules/constants";
import { ParamsGUI, isGUIHidden, buildGUI, updateParamsByGUI } from "./modules/gui";
import { ParamNum, Color, URLParamsToParams } from "./modules/param";

/* 参考元
  Penrose Tiling Explained
  https://preshing.com/20110831/penrose-tiling-explained/
*/

type PenroseTileParams = {
  subdivisionsN: ParamNum;
  triangleN: ParamNum;
  ratio: ParamNum;
  lineWidth: ParamNum;
  scale: ParamNum;
  color1: Color;
  color2: Color;
  lineColor: Color;
}

type Triangle = {
  isColor2: boolean,
  v1: p5.Vector,
  v2: p5.Vector,
  v3: p5.Vector,
}

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

const makeTriangles = (
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

const drawTriangle = (p: p5, tri: Triangle) => {
  p.triangle(tri.v1.x, tri.v1.y, tri.v2.x, tri.v2.y, tri.v3.x, tri.v3.y);
}

const drawOutLine = (p: p5, tri: Triangle) => {
  p.line(tri.v3.x, tri.v3.y, tri.v1.x, tri.v1.y);
  p.line(tri.v1.x, tri.v1.y, tri.v2.x, tri.v2.y);
}

const sketch = (p: p5) => {
  let params: PenroseTileParams = {
    subdivisionsN: {val: 8, min: 1, max: 10, isInt: true},
    triangleN: {val: 10, min: 3, max: 15, isInt: true},
    ratio: {val: 1.0, min: 0.2, max: 2, isInt: false},
    lineWidth: {val: 1, min: 0, max: 10, isInt: true},
    scale: {val: 1.0, min: 0.1, max: 1.8, isInt: false},
    color1: {r: 255, g:255, b: 255},
    color2: {r: 255, g:255, b: 255},
    lineColor: {r: 0, g:0, b: 0},
  }

  URLParamsToParams(params);

  const goldenRatio = (1 + p.sqrt(5)) / 2;
  let triangleN: number;
  let radius: number;
  let ratio: number;
  let lineWidth: number;
  let color1: p5.Color;
  let color2: p5.Color;
  let lineColor: p5.Color;
  let triangles: Triangle[];

  const updateStat = () => {
    triangleN = params.triangleN.val;
    radius = 0.6 * p.width * params.scale.val;
    ratio = goldenRatio * params.ratio.val;
    lineWidth = params.lineWidth.val;
    color1 = p.color(params.color1.r, params.color1.g, params.color1.b);
    color2 = p.color(params.color2.r, params.color2.g, params.color2.b);
    lineColor = p.color(params.lineColor.r, params.lineColor.g, params.lineColor.b);
  }

  let paramsGUI: ParamsGUI;
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(FPS);

    updateStat();
    if (!isGUIHidden()) paramsGUI = buildGUI(p, params);

    triangles = makeTriangles(p, params.subdivisionsN.val, triangleN, ratio, radius);
  }

  p.draw = () => {
    p.clear();
    if (!isGUIHidden()) {
      if (updateParamsByGUI(params, paramsGUI)) {
        triangles = makeTriangles(
          p, params.subdivisionsN.val, triangleN, ratio, radius
        );
      }
    }
    updateStat();

    p.translate(p.width/2, p.height/2);

    p.noStroke();
    triangles.forEach((tri) => {
      if (tri.isColor2) {
        p.fill(color2);
      } else {
        p.fill(color1);
      }
      drawTriangle(p, tri);
    })

    p.stroke(lineColor);
    p.strokeWeight(lineWidth);
    triangles.forEach((tri) => {
      drawOutLine(p, tri);
    })
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
}

new p5(sketch);