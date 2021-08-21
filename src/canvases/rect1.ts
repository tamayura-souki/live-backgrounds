import p5 from "p5";
import { FPS } from "./modules/constants";
import { ParamNum, Color, frameToSecond, ParamGUIs, buildGUIs} from "./modules/utils";
import { easeInOutBack, frameToEaseX } from "./modules/easings";

type Rect1Params = {
  popPeriodF: ParamNum;
  spreadTime: ParamNum;
  waitTime: ParamNum;
  spreadTime2: ParamNum;
  rectMargine: ParamNum;
  lineWidth: ParamNum;
  lineColor: Color;
  maxRectN: ParamNum;
}

const sketch = (p: p5) => {
  let params: Rect1Params = {
    popPeriodF: {val: 3, min: 1, max: 60, isInt: true},
    spreadTime: {val: 3.0, min: 0.0, max: 60.0, isInt: false},
    waitTime: {val: 2.0, min: 0.0, max: 30.0, isInt: false},
    spreadTime2: {val: 1.0, min: 0.0, max: 60.0, isInt: false},
    rectMargine: {val: 50, min: 0, max: p.width, isInt: true},
    lineWidth: {val: 10, min: 1, max: 100, isInt: true},
    lineColor: {r: 0, g: 255, b:0 },
    maxRectN: {val: 8, min: 1, max: 50, isInt: true},
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
      if(passedTime <= params.spreadTime.val){
        rectRate = easeInOutBack(
          frameToEaseX(this.passedFrame(), params.spreadTime.val)
        );
      }else if(passedTime <= params.spreadTime.val+params.waitTime.val) {
        rectRate = 1.0;
        this.startFrame2 = p.frameCount;
      }else if(passedTime <= params.spreadTime.val+params.waitTime.val+params.spreadTime2.val) {
        rectRate = 1.0 + 0.2 * frameToEaseX(p.frameCount-this.startFrame2, params.spreadTime2.val);
      }else {
        this.startFrame = p.frameCount;
      }
      p.push();
      p.strokeWeight(params.lineWidth.val);
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
    Rect.width = p.width-2*params.rectMargine.val;
    Rect.height = p.height-2*params.rectMargine.val;
  }

  p.draw = () => {
    p.clear();

    if(p.frameCount%params.popPeriodF.val==0 && i < params.maxRectN.val) {
      rects.push(new Rect(p.color(
        params.lineColor.r, params.lineColor.g, params.lineColor.b,
        (1.0-i/params.maxRectN.val)*255
      )));
      i++;
    }
    rects.forEach((r) => {
      r.draw()
    })
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    Rect.width = p.width-2*params.rectMargine.val;
    Rect.height = p.height-2*params.rectMargine.val;
  }
}

new p5(sketch);