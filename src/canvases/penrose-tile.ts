import p5 from "p5";
import { ParamNum, Color } from "./modules/param";
import { StillSketch } from "./modules/sketch";
import { Triangle, drawTriangle, drawPartialOutline } from "./modules/triangle";
import { makeTriangles } from "./modules/penrose-tile";

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

class PenroseTile extends StillSketch {
   params: PenroseTileParams = {
    subdivisionsN: {val: 8, min: 1, max: 10, isInt: true},
    triangleN: {val: 10, min: 3, max: 15, isInt: true},
    ratio: {val: 1.0, min: 0.2, max: 2, isInt: false},
    lineWidth: {val: 1, min: 0, max: 10, isInt: true},
    scale: {val: 1.0, min: 0.1, max: 1.8, isInt: false},
    color1: {r: 255, g:255, b: 255},
    color2: {r: 255, g:255, b: 255},
    lineColor: {r: 0, g:0, b: 0},
  }

  goldenRatio: number;
  triangleN: number;
  radius: number;
  ratio: number;
  lineWidth: number;
  color1: p5.Color;
  color2: p5.Color;
  lineColor: p5.Color;
  triangles: Triangle[];

  updateStat(p: p5): void {
    this.triangleN = this.params.triangleN.val;
    this.radius = 0.6 * p.width * this.params.scale.val;
    this.ratio = this.goldenRatio * this.params.ratio.val;
    this.lineWidth = this.params.lineWidth.val;

    const col1 = this.params.color1, col2 = this.params.color2;
    const lineCol = this.params.lineColor;
    this.color1 = p.color(col1.r, col1.g, col1.b);
    this.color2 = p.color(col2.r, col2.g, col2.b);
    this.lineColor = p.color(lineCol.r, lineCol.g, lineCol.b);

    this.triangles = makeTriangles(
      p, this.params.subdivisionsN.val, this.triangleN, this.ratio, this.radius
    );
  }
  setup(p: p5): void {
    this.goldenRatio = (1 + p.sqrt(5)) / 2;
  }
  draw(p: p5): void {
    p.translate(p.width/2, p.height/2);

    p.noStroke();
    this.triangles.forEach((tri) => {
      if (tri.isColor2) {
        p.fill(this.color2);
      } else {
        p.fill(this.color1);
      }
      drawTriangle(p, tri);
    })

    p.stroke(this.lineColor);
    p.strokeWeight(this.lineWidth);
    this.triangles.forEach((tri) => {
      drawPartialOutline(p, tri);
    })
  }
}

new PenroseTile().showSketch();