import p5 from "p5";
import { FPS } from "./modules/constants";
import { buildGUIs, Color, frameToSecond, ParamGUIs } from "./modules/utils";
import { easeInOutBack, frameToEaseX } from "./modules/easings";

type Rect1Params = {
  popPeriodF: number;
  spreadTime: number;
  waitTime: number;
  spreadTime2: number;
  rectMargine: number;
  lineWidth: number;
  lineColor: Color;
  maxRectN: number;
}

const sketch = (p: p5) => {
  let params: Rect1Params = {
    popPeriodF: 3,
    spreadTime: 3.0,
    waitTime: 2.0,
    spreadTime2: 1.0,
    rectMargine: 50,
    lineWidth: 10,
    lineColor: {r: 0, g: 255, b:0 },
    maxRectN: 8,
  }

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
      if(passedTime <= params.spreadTime){
        rectRate = easeInOutBack(
          frameToEaseX(this.passedFrame(), params.spreadTime)
        );
      }else if(passedTime <= params.spreadTime+params.waitTime) {
        rectRate = 1.0;
        this.startFrame2 = p.frameCount;
      }else if(passedTime <= params.spreadTime+params.waitTime+params.spreadTime2) {
        rectRate = 1.0 + 0.2 * frameToEaseX(p.frameCount-this.startFrame2, params.spreadTime2);
      }else {
        this.startFrame = p.frameCount;
      }
      p.push();
      p.strokeWeight(params.lineWidth);
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
  let paramGUIs: ParamGUIs;
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(FPS);

    paramGUIs = buildGUIs(p, params);
    Rect.width = p.width-2*params.rectMargine;
    Rect.height = p.height-2*params.rectMargine;
  }

  p.draw = () => {
    p.clear();

    if(p.frameCount%params.popPeriodF==0 && i < params.maxRectN) {
      rects.push(new Rect(p.color(
        params.lineColor.r, params.lineColor.g, params.lineColor.b,
        (1.0-i/params.maxRectN)*255
      )));
      i++;
    }
    rects.forEach((r) => {
      r.draw()
    })
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    Rect.width = p.width-2*params.rectMargine;
    Rect.height = p.height-2*params.rectMargine;
  }
}

new p5(sketch);