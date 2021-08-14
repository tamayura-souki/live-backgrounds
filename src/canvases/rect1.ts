import p5 from "p5";
import { FPS } from "./modules/constants";
import { Color, frameToSecond } from "./modules/utils";
import { easeInOutBack, frameToEaseX } from "./modules/easings";

const sketch = (p: p5) => {
  const popPeriodF: number = 3;
  const spreadTime: number = 3.0;
  const waitTime: number = 2.0;
  const spreadTime2: number = 1.0;
  const rectMargine: number = 50;
  const lineWidth: number = 10;
  const lineColor: Color = {r: 0, g: 255, b:0 };
  const maxRectN: number = 8;

  class Rect {
    static width: number;
    static height: number;

    startFrame: number;
    startFrame2: number;
    lineColor: p5.Color;

    constructor(color: p5.Color) {
      this.lineColor = color;
      this.startFrame = p.frameCount;
    }

    passedFrame() {
      return p.frameCount-this.startFrame;
    }

    draw() {
      let rectRate = 2.0;
      const passedTime = frameToSecond(this.passedFrame());
      if(passedTime <= spreadTime){
        rectRate = easeInOutBack(
          frameToEaseX(this.passedFrame(), spreadTime)
        );
      }else if(passedTime <= spreadTime+waitTime) {
        rectRate = 1.0;
        this.startFrame2 = p.frameCount;
      }else if(passedTime <= spreadTime+waitTime+spreadTime2) {
        rectRate = 1.0 + 0.2 * frameToEaseX(p.frameCount-this.startFrame2, spreadTime2);
      }else {
        this.startFrame = p.frameCount;
      }
      p.push();
      p.strokeWeight(lineWidth);
      p.stroke(this.lineColor);
      p.noFill();
      p.translate(p.width/2, p.height/2);
      p.scale(rectRate);
      p.rect(
        -Rect.width/2, -Rect.height/2,
        Rect.width, Rect.height
      );
      p.pop();
    }
  }

  const rects: Array<Rect> = [];
  let i=0;
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(FPS);
    Rect.width = p.width-2*rectMargine;
    Rect.height = p.height-2*rectMargine;
  }

  p.draw = () => {
    p.clear();

    if(p.frameCount%popPeriodF==0 && i < maxRectN) {
      rects.push(new Rect(p.color(
        lineColor.r, lineColor.g, lineColor.b,
        (1.0-i/maxRectN)*255
      )));
      i++;
    }
    rects.forEach((r) => {
      r.draw()
    })
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    Rect.width = p.width-2*rectMargine;
    Rect.height = p.height-2*rectMargine;
  }
}

new p5(sketch);