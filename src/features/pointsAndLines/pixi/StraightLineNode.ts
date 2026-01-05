import { Graphics, Point, resolveCompressedTextureUrl, Ticker } from 'pixi.js';
import type { PointNode } from './PointNode';

export class StraightLineNode extends Graphics {
  private startPoint: Point;
  private endPoint: Point;
  private progress = 0;
  private animationSpeed = 0.02;

  constructor(startPoint: PointNode, endPoint: PointNode) {
    super();

    this.startPoint = new Point(startPoint.x, startPoint.y);
    this.endPoint = new Point(endPoint.x, endPoint.y);
    this.label = 'straight-line-node';
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

  private draw(t: number) {
    const currentX =
      this.startPoint.x + (this.endPoint.x - this.startPoint.x) * t;
    const currentY =
      this.startPoint.y + (this.endPoint.y - this.startPoint.y) * t;

    this.clear()
      .moveTo(this.startPoint.x, this.startPoint.y)
      .lineTo(currentX, currentY)
      .stroke('#000000');
  }
}
