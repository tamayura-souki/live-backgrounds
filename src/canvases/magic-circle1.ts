import p5 from "p5";
import { TAMAYURA_BLUE } from "./modules/constants";
import { Point, nGon } from "./modules/utils";
import { AnimationSketch } from "./modules/sketch";

// 波紋
class Ripple {
  static a: number = 0.005;
  static transV: number = 0.005;
  static minV: number = 2;
  static maxV: number = 10;
  static maxWait: number = 1;
  static lineWidth: number = 10;

  pos: Point;
  r: number;
  v: number;
  trans: number;
  color: p5.Color;

  constructor() {
    this.trans = -Ripple.maxWait;
  }

  draw(p: p5) {
    // 透明になった後の処理
    if (this.trans <= -p.random(0, Ripple.maxWait)) {
      this.pos = {x: p.random(0, p.width), y: p.random(0, p.height)};
      this.r = 0;
      this.v = p.random(Ripple.minV, Ripple.maxV);
      this.trans = 1.0;
      this.color = p.color(TAMAYURA_BLUE);
    }

    // 通常の描画処理
    p.strokeWeight(Ripple.lineWidth*this.trans);
    p.stroke(this.color);
    this.color.setAlpha(this.trans*255);
    p.circle(this.pos.x, this.pos.y, this.r);
    this.v -= Ripple.a;
    this.r += this.v;
    this.trans -= Ripple.transV;
  }
}

class MagicCircle1 extends AnimationSketch {
  params: Object = null;

  readonly rRate: number = 0.42;
  readonly v: number = 0.4;
  readonly ripple: Array<Ripple> = [];
  lineColor: p5.Color;

  magicCircle(p: p5, count: number): void {
    p.strokeWeight(p.height*0.01);
    p.stroke(this.lineColor);
    p.noFill();

    const pos = {x: p.width/2, y: p.height/2};
    nGon(p, 3, pos, p.height*this.rRate, this.v*count);
    nGon(p, 4, pos, p.height*this.rRate, -this.v*count);
  }

  updateStat(p: p5): void {}
  setup(p: p5): void {
    this.lineColor = p.color(TAMAYURA_BLUE);
    for(let i=0; i<3; i++) {
      this.ripple.push(new Ripple());
    }
  }

  draw(p: p5): void {
    p.clear();
    this.magicCircle(p, p.frameCount);
    this.ripple.forEach(r => {r.draw(p)});
  }
}

new MagicCircle1().showSketch();