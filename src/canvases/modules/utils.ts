import p5 from "p5";

export type Point = {
  x: number,
  y: number
}

export const nGon = (
  p5: p5,
  n: number, pos: Point, r: number, deg: number = 0) => {

  deg = p5.TWO_PI * deg / 360;

  p5.push();
  p5.translate(pos.x, pos.y);
  p5.beginShape();
  for(let i=0; i<n; i++) {
    let angle = p5.TWO_PI / n * i + deg;
    let px = p5.sin(angle) * r;
    let py = p5.cos(angle) * r;
    p5.vertex(px, py, 0);
  }
  p5.endShape(p5.CLOSE);
  p5.pop();
}