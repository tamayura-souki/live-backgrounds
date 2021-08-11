import p5 from "p5";

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(1920, 1080);
  };

  p.draw = () => {
    p.background(220);
    p.ellipse(50, 50, 80, 80);
  };
};

new p5(sketch);