import { Graphics, Point } from 'pixi.js';

export class CurvedLineNode extends Graphics {
  private startPoint: Point;
  private controlPoint: Point;
  private endPoint: Point;

  constructor(startPoint: Point, controlPoint: Point, endPoint: Point) {
    super();

    this.startPoint = startPoint;
    this.controlPoint = controlPoint;
    this.endPoint = endPoint;
    this.label = 'curved-line-node';

    this.draw();
  }

  private draw() {
    this.clear();

    this.moveTo(this.startPoint.x, this.startPoint.y)
      .quadraticCurveTo(
        this.controlPoint.x,
        this.controlPoint.y,
        this.endPoint.x,
        this.endPoint.y,
      )
      .stroke('#000000');
  }
}
