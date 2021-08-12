import p5 from "p5";
import { WIDTH, HEIGHT, FPS, TAMAYURA_BLUE } from "./modules/constants";
import { nGon } from "./modules/functions";

// 波紋
class Ripple {
  static a: number = 0.005;
  static transV: number = 0.005;
  static minV: number = 2;
  static maxV: number = 10;
  static maxWait: number = 1;
  static lineWidth: number = 10;

  x: number;
  y: number;
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
      this.x = p.random(0, WIDTH);
      this.y = p.random(0, HEIGHT);
      this.r = 0;
      this.v = p.random(Ripple.minV, Ripple.maxV);
      this.trans = 1.0;
      this.color = p.color(TAMAYURA_BLUE);
    }

    // 通常の描画処理
    p.strokeWeight(Ripple.lineWidth*this.trans);
    p.stroke(this.color);
    this.color.setAlpha(this.trans*255);
    p.circle(this.x, this.y, this.r);
    this.v -= Ripple.a;
    this.r += this.v;
    this.trans -= Ripple.transV;
  }
}

const sketch = (p: p5) => {
  const r: number = HEIGHT*0.42;
  const v: number = 0.4;
  const lineWidth: number = 10;
  const lineColor: p5.Color = p.color(TAMAYURA_BLUE);
  const ripple: Array<Ripple> = [];

  const magicCircle = (count: number) => {
    p.strokeWeight(lineWidth);
    p.stroke(lineColor);
    p.noFill();

    nGon(p, 3, WIDTH/2, HEIGHT/2, r, v*count);
    nGon(p, 4, WIDTH/2, HEIGHT/2, r, -v*count);
  }

  p.setup = () => {
    p.frameRate(FPS);
    p.createCanvas(WIDTH, HEIGHT);

    for(let i=0; i<3; i++) {
      ripple.push(new Ripple());
    }
  };

  p.draw = () => {
    p.clear();
    magicCircle(p.frameCount);
    ripple.forEach(r => {r.draw(p)});
  };
};

new p5(sketch);