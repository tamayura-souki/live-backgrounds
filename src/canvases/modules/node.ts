import p5 from "p5";
import { isNear, Point } from "./utils";

export class Node {
  v: Point
  pos: Point
  collisionNow: boolean
}

export const collideNode = (r: number, a: Node, b: Node) => {
  if(isNear(r, a.pos, b.pos)) {
    if(a.collisionNow || b.collisionNow) {
      a.collisionNow = true;
      b.collisionNow = true;
      return;
    }
    [a.v, b.v] = [b.v, a.v];
    a.collisionNow = true;
    b.collisionNow = true;

  } else {
    if(!(a.collisionNow && b.collisionNow)) return;
    a.collisionNow = false;
    b.collisionNow = false;
  }
}

export const generateRandomNodes = (
  p: p5, n: number,
  maxV: number, minV: number,
  ): Node[] => {
  const retNodes: Node[] = [];
  const x_margin = p.width / n*1.8;
  const y_margin = p.height / n*1.8;
  for(let i=0; i<n; i++) {
    const v = p.random(minV, maxV);
    const rad = p.random(0, 2*p.PI);
    retNodes.push({
      v : {x: v*p.cos(rad), y: v*p.sin(rad)},
      // pos: {x: p.random(0, p.width), y: p.random(0, p.height)},
      pos: {x: (x_margin*i) % p.width, y: (y_margin*i*(n/2)) % p.height},
      collisionNow: true,
    });
  }
  return retNodes;
}
