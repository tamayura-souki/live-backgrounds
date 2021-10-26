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
  // パラメータ増やすか考える
}

class EuclidRect1 extends StillSketch {
  params: EuclidRect1Params = {
    ratio: {val: 0.6, min: 0.2, max: 1.1, isInt: false},
    ratio2: {val: 1.0, min: 0.0, max: 2.0, isInt: false},
    thr: {val: 50, min: 10, max: 320, isInt: true},
    lineColor: {r: 0, g: 0, b: 0},
    lineWidth: {val: 1.0, min: 0.0, max: 20.0, isInt: true},
  };

  ratio: number;
  thr: number;
  lineColor: p5.Color;
  lineWidth: number;

  updateStat(p: p5): void {
    this.ratio = this.params.ratio.val + this.params.ratio2.val;
    this.thr = this.params.thr.val;
    let lineCol = rgbToHSB(this.params.lineColor);
    this.lineColor = p.color(lineCol.r, lineCol.g, lineCol.b);
    this.lineWidth = this.params.lineWidth.val;
  }

  setup(p: p5): void {
  }

  draw(p: p5): void {
    p.stroke(this.lineColor);
    p.strokeWeight(this.lineWidth);
    p.colorMode(p.HSB, 1);
    this.divSquare(p, 0, 0, p.max(p.width, p.height));
  }

  divSquare(p: p5, xPos: number, yPos: number, wd: number) {
    let itr: number = 0;
    let xEndPos: number = wd + xPos;
    let yEndPos: number = wd + yPos;
    p.fill(p.color(p.random(0,1), p.random(0, 1.0), p.random(1.0, 1.0)));
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
    p.fill(p.color(p.random(0,1), p.random(0, 1.0), p.random(1.0, 1.0)));
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
