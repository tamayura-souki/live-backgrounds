import p5 from "p5";
import { FPS } from "./modules/constants";
import { ParamNum, Color } from "./modules/param";
import { easeInOutBack, frameToEaseX } from "./modules/easings";
import { AnimationSketch } from "./modules/sketch";

type Rect1Params = {
  period: ParamNum;
  popPeriod: ParamNum;
  lineColor: Color;
  maxRectN: ParamNum;
}

const easing = (
  passedFrame: number, spreadFrame: number,
  waitFrame: number, spreadFrame2: number
): number => {
  if(passedFrame <= spreadFrame) {
    return easeInOutBack(frameToEaseX(passedFrame, spreadFrame));
  }else if (passedFrame <= spreadFrame+waitFrame) {
    return 1.0;
  }else if (passedFrame <= spreadFrame+waitFrame+spreadFrame2) {
    const passedFrame2 = passedFrame-spreadFrame-waitFrame;
    return 1.0 + 0.2 * frameToEaseX(passedFrame2, spreadFrame2);
  }else {
    return 2.0;
  }
}

class Rect1 extends AnimationSketch {
  params: Rect1Params = {
    period: {val: 6.0, min: 1.0, max: 30.0, isInt: false},
    popPeriod: {val: 0.05, min: 0.01, max: 0.5, isInt: false},
    lineColor: {r: 0, g: 255, b:0 },
    maxRectN: {val: 8, min: 1, max: 50, isInt: true},
  };

  static readonly lineWidth = 10;
  static readonly rectMargine = 50;

  periodFrame: number;
  popPeriodFrame: number;
  spreadFrame: number;
  waitFrame: number;
  spreadFrame2: number;
  rect_width: number;
  rect_height: number;

  rectRate = (passedFrame: number): number =>
    (easing(passedFrame, this.spreadFrame, this.waitFrame, this.spreadFrame2));

  lineAlpha = (i: number): number =>
    ((1.0-i/this.params.maxRectN.val)*255);

  updateStat(p: p5): void {
    this.periodFrame = this.params.period.val * FPS;
    this.popPeriodFrame = this.params.popPeriod.val * FPS;
    this.spreadFrame = this.periodFrame * 0.5;
    this.waitFrame = this.periodFrame * 0.35;
    this.spreadFrame2 = this.periodFrame * 0.15;

    this.rect_width = p.width-2*Rect1.rectMargine;
    this.rect_height = p.height-2*Rect1.rectMargine;
  }

  setup(p: p5): void {
    p.strokeWeight(Rect1.lineWidth);
    p.noFill();
  }

  draw(p: p5): void {
    p.clear();

    const col = this.params.lineColor;
    for(let i=0; i < this.params.maxRectN.val; i++) {
      p.push();
      p.stroke(p.color(col.r, col.g, col.b, this.lineAlpha(i)));
      p.translate(p.width/2, p.height/2);
      p.scale(this.rectRate(
        (p.frameCount-i*this.popPeriodFrame) % this.periodFrame)
      );
      p.rect(
        -this.rect_width/2, -this.rect_height/2,
        this.rect_width, this.rect_height
      );
      p.pop();
    }
  }
}

new Rect1().showSketch();