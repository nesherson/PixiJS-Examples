import { Graphics, Point } from "pixi.js";

export class StraightLineNode extends Graphics {
  private startPoint: Point;
  private endPoint: Point;

  constructor(startPoint: Point, endPoint: Point) {
    super();

    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.label = "straight-line-node";

    this.draw();
  }

  private draw() {
    this.clear();

    this.moveTo(this.startPoint.x, this.startPoint.y).lineTo(this.endPoint.x, this.endPoint.y).stroke("#000000");
  }
}
