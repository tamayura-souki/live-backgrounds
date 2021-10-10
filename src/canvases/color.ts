import p5 from "p5";
import { ParamNum, Color } from "./modules/param";
import { StillSketch } from "./modules/sketch";

type ColorParams = {
  color: Color;
  alpha: ParamNum;
}

class OneColor extends StillSketch {
  params: ColorParams = {
    color: {r: 0, g: 255, b: 0 },
    alpha: {val: 255, min: 0, max: 255, isInt: true},
  }
  color: p5.Color;

  updateStat = (p: p5) => {
    const col = this.params.color;
    this.color = p.color(col.r, col.g, col.b, this.params.alpha.val);
  };

  setup = (p: p5) => {};

  draw = (p: p5) => {
    p.clear();
    p.background(this.color);
  };
}

new OneColor().showSketch();