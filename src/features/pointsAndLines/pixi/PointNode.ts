import { Graphics } from 'pixi.js';

export class PointNode extends Graphics {
  public isSelected: boolean = false;
  public canBeSelected: boolean = true;
  private radius: number = 3;

  constructor(x?: number, y?: number) {
    super();
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.eventMode = 'static';
    this.label = 'point-node';

    this.draw();
  }
  public draw() {
    this.clear();

    const color = this.isSelected ? '#00ff00' : '#ff4d4d';

    this.circle(0, 0, this.radius);
    this.fill(color);
  }

  public toggleSelection() {
    this.isSelected = !this.isSelected;
    this.draw();
  }

  public disableSelection() {
    this.canBeSelected = false;
  }
}
