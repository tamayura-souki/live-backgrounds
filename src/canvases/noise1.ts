import p5 from "p5";
import { FPS } from "./modules/constants";

const sketch = (p: p5) => {
  const v: number = 1.0;
  const seed1: number = 10;
  const length: number = 200;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(FPS);
  }

  p.draw = () => {
    p.clear();

    for(let y=0; y<p.width; y++) {
      let noise = p.noise((p.frameCount+y)*v%length, p.random(0, seed1));
      p.strokeWeight(1);
      p.stroke(noise*255);
      p.line(0, y, p.width, y);
    }
 }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
}

new p5(sketch);