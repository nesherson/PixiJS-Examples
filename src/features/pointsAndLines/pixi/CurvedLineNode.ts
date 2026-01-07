import { Graphics, Point, Ticker } from 'pixi.js';
import { lerp } from './utils';

export class CurvedLineNode extends Graphics {
  private startPoint: Point;
  private controlPoint: Point;
  private endPoint: Point;
  private progress = 0;
  private animationSpeed;

  constructor(
    startPoint: Point,
    controlPoint: Point,
    endPoint: Point,
    animationSpeed?: number,
  ) {
    super();

    this.startPoint = startPoint;
    this.controlPoint = controlPoint;
    this.endPoint = endPoint;
    this.label = 'curved-line-node';
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

  public draw(t = 1) {
    const intermediateControl = lerp(this.startPoint, this.controlPoint, t);
    const leg2 = lerp(this.controlPoint, this.endPoint, t);
    const currentTip = lerp(intermediateControl, leg2, t);

    this.clear()
      .moveTo(this.startPoint.x, this.startPoint.y)
      .quadraticCurveTo(
        intermediateControl.x,
        intermediateControl.y,
        currentTip.x,
        currentTip.y,
      )
      .stroke('#000000');
  }
}
