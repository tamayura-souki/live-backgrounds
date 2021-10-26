import p5 from "p5";
import { ParamNum, Color } from "./modules/param";
import { StillSketch } from "./modules/sketch";

/* 参考元
  巴山竜来, 数学から創るジェネラティブアート, 技術評論社
  https://gihyo.jp/book/2019/978-4-297-10463-4
*/

type EuclidRect1Params = {
}

class EuclidRect1 extends StillSketch {
  params: EuclidRect1Params = {};

  readonly numA: number = 10;
  readonly numB: number = 6;
  readonly ratio: number = this.numB / this.numA;

  readonly thr: number = 50;

  updateStat(p: p5): void {
  }

  setup(p: p5): void {
    p.colorMode(p.HSB, 1);
  }

  draw(p: p5): void {
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
