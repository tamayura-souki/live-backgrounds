import p5 from "p5";
import { ParamNum, Color, rgbToHSB } from "./modules/param";
import { StillSketch } from "./modules/sketch";

/* 参考元
  巴山竜来, 数学から創るジェネラティブアート, 技術評論社
  https://gihyo.jp/book/2019/978-4-297-10463-4
*/

type MondrianParams = {
  ratio: ParamNum;
  ratio2: ParamNum;
  thr: ParamNum;
  thr2: ParamNum;
  lineColor: Color;
  lineWidth: ParamNum;
}

class Mondrian extends StillSketch {
  params: MondrianParams = {
    ratio: {val: 0.618, min: 0.2, max: 1.1, isInt: false},
    ratio2: {val: 1.0, min: 0.0, max: 2.0, isInt: false},
    thr: {val: 80, min: 10, max: 320, isInt: true},
    thr2: {val: 0.5, min: 0, max: 1, isInt: false},
    lineColor: {r: 0, g: 0, b: 0},
    lineWidth: {val: 10, min: 0.0, max: 20.0, isInt: true},
 };

  ratio: number;
  thr: number;
  thr2: number;
  lineColor: p5.Color;
  lineWidth: number;
  updateStat(p: p5): void {
    this.ratio = this.params.ratio.val + this.params.ratio2.val;
    this.thr = this.params.thr.val;
    this.thr2 = this.params.thr2.val;
    let lineCol = rgbToHSB(this.params.lineColor);
    this.lineColor = p.color(lineCol.r, lineCol.g, lineCol.b);
    this.lineWidth = this.params.lineWidth.val;
  }

  setup(p: p5): void {
    p.colorMode(p.HSB, 1);
  }

  draw(p: p5): void {
    p.stroke(this.lineColor);
    p.strokeWeight(this.lineWidth);
    let longerLength =  p.max(p.width, p.height);
    this.colorRect(p, 0, 0, longerLength, longerLength);
    this.divSquare(p, 0, 0, longerLength);
  }

  divSquare(p: p5, xPos: number, yPos: number, wd: number) {
    let itr: number = 0;
    let xEndPos: number = wd + xPos;
    let yEndPos: number = wd + yPos;

    while (wd > this.thr) {
      itr++;
      if (itr % 2 === 1) {
        while (xPos + wd * this.ratio < xEndPos + 0.1) {
          this.colorRect(p, xPos, yPos, wd * this.ratio, wd);
          if (p.random(0, 1.0) < this.thr2) {
            this.divRect(p, xPos, yPos, wd * this.ratio);
          }
          xPos += wd * this.ratio;
        }
        wd = xEndPos - xPos;
      } else {
        while (yPos + wd / this.ratio < yEndPos + 0.1) {
          this.colorRect(p, xPos, yPos, wd, wd / this.ratio);
          if (p.random(0, 1) < this.thr2) {
            this.divRect(p, xPos, yPos, wd);
          }
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

    while(wd > this.thr) {
      itr++;
      if (itr % 2 === 0) {
        while (xPos + wd < xEndPos + 0.1) {
          this.colorRect(p, xPos, yPos, wd, wd);
          if (p.random(0, 1) < this.thr2) {
            this.divSquare(p, xPos, yPos, wd);
          }
          xPos += wd;
        }
        wd = xEndPos - xPos;
      } else {
        while (yPos + wd < yEndPos + 0.1) {
          this.colorRect(p, xPos, yPos, wd, wd);
          if (p.random(0, 1) < this.thr2) {
            this.divSquare(p, xPos, yPos, wd);
          }
          yPos += wd;
        }
        wd = yEndPos - yPos;
      }
    }
  }

  colorRect(p: p5, xPos: number, yPos: number, wd: number, ht: number) {
    let col: p5.Color;
    let val = p.random(0, 1);
    if (val < 0.15) {
      col = p.color(0, 1, 1); // 赤
    } else if (val < 0.3) {
      col = p.color(2.0/3, 1, 1); // 青
    } else if (val < 0.45) {
      col = p.color(1.0/6, 1, 1); // 黄
    } else if (val < 0.5) {
      col = p.color(0, 1, 0); // 黒
    } else if (val< 0.7) {
      col = p.color(0, 0, 0.9); // 灰
    } else {
      col = p.color(0, 0, 1);
    }
    p.fill(col);
    p.rect(xPos, yPos, wd, ht);
  }
}

new Mondrian().showSketch();
