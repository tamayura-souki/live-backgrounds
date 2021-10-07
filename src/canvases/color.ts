import p5 from "p5";
import { FPS } from "./modules/constants";
import { ParamNum, Color, URLParamsToParams } from "./modules/param";
import { ParamGUIs, isHiddenGUIs, buildGUIs, updateGUIs } from "./modules/gui";

type ColorParams = {
  color: Color;
  alpha: ParamNum;
}

const sketch = (p: p5) => {
  let params: ColorParams = {
    color: {r: 0, g: 255, b: 0 },
    alpha: {val: 255, min: 0, max: 255, isInt: true},
  }

  URLParamsToParams(params);

  let color;
  const updateStat = () => {
    color = p.color(params.color.r, params.color.g, params.color.b, params.alpha.val);
  }

  let paramGUIs: ParamGUIs;
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(FPS);

    updateStat();

    if (!isHiddenGUIs()) paramGUIs = buildGUIs(p, params);
  }

  p.draw = () => {
    p.clear()
    if (!isHiddenGUIs()) updateGUIs(params, paramGUIs);
    updateStat();

    p.background(color);
  }


  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
}

new p5(sketch);