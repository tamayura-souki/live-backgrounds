import p5 from "p5";
import { ParamNum, Color, rgbToHSB } from "./modules/param";
import { StillSketch } from "./modules/sketch";

/* 参考元
  巴山竜来, 数学から創るジェネラティブアート, 技術評論社
  https://gihyo.jp/book/2019/978-4-297-10463-4
*/

type EuclidRect1Params = {
  ratio: ParamNum;
  ratio2: ParamNum;
  thr: ParamNum;
  lineColor: Color;
  lineWidth: ParamNum;
  hueMax: ParamNum;
  hueMin: ParamNum;
  saturationMax: ParamNum;
  saturationMin: ParamNum;
  brightnessMax: ParamNum;
  brightnessMin: ParamNum;
}

class EuclidRect1 extends StillSketch {
  params: EuclidRect1Params = {
    ratio: {val: 0.6, min: 0.2, max: 1.1, isInt: false},
    ratio2: {val: 1.0, min: 0.0, max: 2.0, isInt: false},
    thr: {val: 50, min: 10, max: 320, isInt: true},
    lineColor: {r: 0, g: 0, b: 0},
    lineWidth: {val: 1.0, min: 0.0, max: 20.0, isInt: true},
    hueMax: {val: 1.0, min: 0.0, max: 1.0, isInt: false},
    hueMin: {val: 0.0, min: 0.0, max: 1.0, isInt: false},
    saturationMax: {val: 0.5, min: 0.0, max: 1.0, isInt: false},
    saturationMin: {val: 0.3, min: 0.0, max: 1.0, isInt: false},
    brightnessMax: {val: 1.0, min: 0.0, max: 1.0, isInt: false},
    brightnessMin: {val: 1.0, min: 0.0, max: 1.0, isInt: false},
  };

  ratio: number;
  thr: number;
  lineColor: p5.Color;
  lineWidth: number;
  hueMax: number;
  hueMin: number;
  saturationMax: number;
  saturationMin: number;
  brightnessMax: number;
  brightnessMin: number;

  updateStat(p: p5): void {
    this.ratio = this.params.ratio.val + this.params.ratio2.val;
    this.thr = this.params.thr.val;
    let lineCol = rgbToHSB(this.params.lineColor);
    this.lineColor = p.color(lineCol.r, lineCol.g, lineCol.b);
    this.lineWidth = this.params.lineWidth.val;
    this.hueMax = this.params.hueMax.val;
    this.hueMin = this.params.hueMin.val;
    this.saturationMax = this.params.saturationMax.val;
    this.saturationMin = this.params.saturationMin.val;
    this.brightnessMax = this.params.brightnessMax.val;
    this.brightnessMin = this.params.brightnessMin.val;
  }

  getColor(p: p5): p5.Color {
    return p.color(
      p.random(this.hueMin,this.hueMax),
      p.random(this.saturationMin, this.saturationMax),
      p.random(this.brightnessMin, this.brightnessMax),
    );
  }

  setup(p: p5): void {
    p.colorMode(p.HSB, 1);
  }

  draw(p: p5): void {
    p.stroke(this.lineColor);
    p.strokeWeight(this.lineWidth);
    this.divSquare(p, 0, 0, p.max(p.width, p.height));
  }

  divSquare(p: p5, xPos: number, yPos: number, wd: number) {
    let itr: number = 0;
    let xEndPos: number = wd + xPos;
    let yEndPos: number = wd + yPos;
    p.fill(this.getColor(p));
    p.rect(xPos, yPos, wd, wd);

    while (wd > this.thr) {
      itr++;
      if (itr % 2 === 1) {
        while (xPos + wd * this.ratio < xEndPos + 0.1) {
          this.divRect(p, xPos, yPos, wd * this.ratio);
          xPos += wd * this.ratio;
        }
        wd = xEndPos - xPos;
      } else {
        while (yPos + wd / this.ratio < yEndPos + 0.1) {
          this.divRect(p, xPos, yPos, wd);
          yPos += wd / this.ratio;
        }
        wd = yEndPos - yPos;
      }
    }
  }

  divRect(p: p5, xPos: number, yPos: number, wd: number) {
    let itr: number = 0;
    let xEndPos: number = xPos + wd;
    let yEndPos: number = yPos + wd / this.ratio;
    p.fill(this.getColor(p));
    p.rect(xPos, yPos, wd, wd / this.ratio);

    while(wd > this.thr) {
      itr++;
      if (itr % 2 === 0) {
        while (xPos + wd < xEndPos + 0.1) {
          this.divSquare(p, xPos, yPos, wd);
          xPos += wd;
        }
        wd = xEndPos - xPos;
      } else {
        while (yPos + wd < yEndPos + 0.1) {
          this.divSquare(p, xPos, yPos, wd);
          yPos += wd;
        }
        wd = yEndPos - yPos;
      }
    }
  }
}

new EuclidRect1().showSketch();
