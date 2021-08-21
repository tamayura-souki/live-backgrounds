import p5 from "p5";
import { FPS } from "./modules/constants";
import { ParamNum, Color } from "./modules/param";
import { ParamGUIs, buildGUIs, updateGUIs } from "./modules/gui";
import { easeInOutBack, frameToEaseX } from "./modules/easings";

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

const sketch = (p: p5) => {
  let params: Rect1Params = {
    period: {val: 6.0, min: 1.0, max: 30.0, isInt: false},
    popPeriod: {val: 0.05, min: 0.01, max: 0.5, isInt: false},
    lineColor: {r: 0, g: 255, b:0 },
    maxRectN: {val: 8, min: 1, max: 50, isInt: true},
  }

  const lineWidth = 10;
  const rectMargine = 50;

  let periodFrame = params.period.val * FPS;
  let popPeriodFrame = params.popPeriod.val * FPS;
  let spreadFrame = periodFrame * 0.5;
  let waitFrame = periodFrame * 0.3;
  let spreadFrame2 = periodFrame * 0.2;
  let rect_width = p.width-2*rectMargine;
  let rect_height = p.height-2*rectMargine;

  const rectRate = (passedFrame: number): number =>
    (easing(passedFrame, spreadFrame, waitFrame, spreadFrame2));

  const updateStat = () => {
    periodFrame = params.period.val * FPS;
    popPeriodFrame = params.popPeriod.val * FPS;
    spreadFrame = periodFrame * 0.5;
    waitFrame = periodFrame * 0.35;
    spreadFrame2 = periodFrame * 0.15;
    rect_width = p.width-2*rectMargine;
    rect_height = p.height-2*rectMargine;
  }

  let paramGUIs: ParamGUIs;
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(FPS);

    updateStat();

    paramGUIs = buildGUIs(p, params);
    p.strokeWeight(lineWidth);
    p.noFill();
  }

  p.draw = () => {
    p.clear();
    updateGUIs(params, paramGUIs);
    updateStat();

    for(let i=0; i < params.maxRectN.val; i++) {
      p.push();
      p.stroke(p.color(params.lineColor.r, params.lineColor.g, params.lineColor.b,
        (1.0-i/params.maxRectN.val)*255
      ));
      p.translate(p.width/2, p.height/2);
      p.scale(rectRate((p.frameCount-i*popPeriodFrame)%periodFrame));
      p.rect(-rect_width/2, -rect_height/2, rect_width, rect_height);
      p.pop();
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
}

new p5(sketch);