import { Graphics, Point } from 'pixi.js';
import type { PointNode } from './PointNode';

export class StraightLineNode extends Graphics {
  private startPoint: Point;
  private endPoint: Point;

  constructor(startPoint: PointNode, endPoint: PointNode) {
    super();

    this.startPoint = new Point(startPoint.x, startPoint.y);
    this.endPoint = new Point(endPoint.x, endPoint.y);
    this.label = 'straight-line-node';

    this.draw();
  }

  private draw() {
    this.clear();

    this.moveTo(this.startPoint.x, this.startPoint.y)
      .lineTo(this.endPoint.x, this.endPoint.y)
      .stroke('#000000');
  }
}
