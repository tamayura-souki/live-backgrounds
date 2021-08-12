import p5 from "p5";

export const nGon = (
  p: p5,
  n: number, x: number, y: number, r: number, deg: number = 0) => {
    deg = p.TWO_PI * deg / 360;

    p.beginShape();
    for(let i=0; i<n; i++) {
      let angle = p.TWO_PI / n * i + deg;
      let px = x + p.sin(angle) * r;
      let py = y + p.cos(angle) * r;
      p.vertex(px, py, 0);
    }
    p.endShape(p.CLOSE);
}