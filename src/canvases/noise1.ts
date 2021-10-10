import p5 from "p5";
import { AnimationSketch } from "./modules/sketch";

class Noise1 extends AnimationSketch {
  params: Object = null;

  readonly v: number = 1.0;
  readonly seed1: number = 10;
  readonly length: number = 200;

  updateStat(p: p5): void {}
  setup(p: p5): void {}
  draw(p: p5): void {
    p.clear();

    for(let y=0; y<p.width; y++) {
      let noise = p.noise(
        (p.frameCount+y)*this.v%length,
        p.random(0, this.seed1)
      );
      p.strokeWeight(1);
      p.stroke(noise*255);
      p.line(0, y, p.width, y);
    }
  }
}

new Noise1().showSketch();