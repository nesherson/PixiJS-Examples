import { Graphics, Point, Ticker } from 'pixi.js';
import type { PointNode } from './PointNode';
import { lerp } from './utils';

export class StraightLineNode extends Graphics {
  private startPoint: Point;
  private endPoint: Point;
  private progress = 0;
  private animationSpeed;

  constructor(
    startPoint: PointNode,
    endPoint: PointNode,
    animationSpeed?: number,
  ) {
    super();

    this.startPoint = new Point(startPoint.x, startPoint.y);
    this.endPoint = new Point(endPoint.x, endPoint.y);
    this.label = 'straight-line-node';
    this.animationSpeed = animationSpeed ?? 0.02;
  }

  public animateLine(): Promise<void> {
    return new Promise((resolve) => {
      this.progress = 0;

      const tick = (ticker: Ticker) => {
        this.progress += this.animationSpeed * ticker.deltaTime;

        if (this.progress >= 1) {
          this.progress = 1;
          this.draw(this.progress);
          Ticker.shared.remove(tick);
          resolve();
        } else {
          this.draw(this.progress);
        }
      };

      Ticker.shared.add(tick);
    });
  }

  public draw(t: number = 1) {
    const currentPoint = lerp(this.startPoint, this.endPoint, t);

    this.clear()
      .moveTo(this.startPoint.x, this.startPoint.y)
      .lineTo(currentPoint.x, currentPoint.y)
      .stroke('#000000');
  }
}
