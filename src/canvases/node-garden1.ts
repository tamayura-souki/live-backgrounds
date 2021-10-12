import p5 from "p5";
import { Node, collideNode, generateRandomNodes } from "./modules/node";
import { ParamNum, Color } from "./modules/param";
import { AnimationSketch } from "./modules/sketch";
import { isNear } from "./modules/utils";

type NodeGarden1Params = {
  nodeR: ParamNum;
  nodeColor: Color;
  nodeN: ParamNum;
  lineLength: ParamNum;
  lineWidth: ParamNum;
  lineColor: Color;
  maxV: ParamNum;
  minV: ParamNum;
};

class NodeGarden1 extends AnimationSketch {
  params: NodeGarden1Params = {
    nodeR: { val: 3, min: 1, max: 50, isInt: true },
    nodeColor: { r: 0, g: 0, b: 0 },
    nodeN: { val: 30, min: 1, max: 100, isInt: true },
    lineLength: { val: 150, min: 1, max: 400, isInt: true },
    lineWidth: { val: 2, min: 1, max: 20, isInt: true },
    lineColor: { r: 0, g: 0, b: 0 },
    maxV: { val: 5.0, min: 1.0, max: 20.0, isInt: false },
    minV: { val: 0.1, min: 0.1, max: 20.0, isInt: false },
  };

  nodes: Node[];
  nodeR: number;
  nodeColor: p5.Color;
  nodeN: number;
  lineLength: number;
  lineWidth: number;
  lineColor: p5.Color;
  maxV: number;
  minV: number;

  updateStat(p: p5): void {
    this.nodeR = this.params.nodeR.val;
    const nCol = this.params.nodeColor;
    this.nodeColor = p.color(nCol.r, nCol.g, nCol.b);
    this.nodeN = this.params.nodeN.val;
    this.lineLength = this.params.lineLength.val;
    this.lineWidth = this.params.lineWidth.val;
    const lCol = this.params.lineColor;
    this.lineColor = p.color(lCol.r, lCol.g, lCol.b);
    this.maxV = this.params.maxV.val;
    this.minV = this.params.minV.val;

    this.nodes = generateRandomNodes(p, this.nodeN, this.maxV, this.minV);
    p.fill(this.nodeColor);
  }

  setup(p: p5): void {
    p.smooth();
  }

  draw(p: p5): void {
    p.clear()

    // 当たり判定
    this.nodes.forEach((n, i) => {
      this.nodes.slice(i+1).forEach((n2) => {
        collideNode(this.nodeR*2, n, n2);
      });
    });

    p.stroke(this.lineColor);
    p.strokeWeight(this.lineWidth);
    this.nodes.forEach((n, i) => {
      this.nodes.slice(i+1).forEach((n2) => {
        if(isNear(this.lineLength, n.pos, n2.pos)) {
          p.line(n.pos.x, n.pos.y, n2.pos.x, n2.pos.y);
        }
      });
    });

    this.nodes.forEach((n) => {
      n.pos.x += n.v.x;
      n.pos.y += n.v.y;
      if (n.pos.x < 0 || n.pos.x > p.width) {
        n.v.x *= -1;
        n.pos.x += n.v.x;
      }
      if (n.pos.y < 0 || n.pos.y > p.height) {
        n.v.y *= -1;
        n.pos.y += n.v.y;
      }
    });

    p.noStroke();
    this.nodes.forEach((n) => {
      p.ellipse(n.pos.x, n.pos.y, this.nodeR*2);
    });
  }
}

new NodeGarden1().showSketch();