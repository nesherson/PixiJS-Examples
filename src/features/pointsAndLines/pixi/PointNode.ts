import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export class PointNode extends Container {
  public point: Graphics;
  public text: Text;
  public isSelected: boolean = false;
  public canBeSelected: boolean = true;
  public showOrder = false;

  private radius: number = 3;
  private order: number = 0;

  constructor(x: number, y: number, order?: number, showOrder?: boolean) {
    super();
    this.label = 'point-node';
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.order = order ?? 0;
    this.point = new Graphics();
    this.text = new Text({
      text: this.order.toString(),
      x: -10,
      y: -15,
      style: new TextStyle({ fontSize: 10 }),
    });
    this.showOrder = showOrder ?? false;
    this.point.eventMode = 'static';

    this.addChild(this.point, this.text);

    this.draw();
  }

  public draw() {
    this.point.clear();

    const color = this.isSelected ? '#00ff00' : '#ff4d4d';

    this.point.circle(0, 0, this.radius);
    this.point.fill(color);
    this.text.visible = this.showOrder;
  }

  public toggleSelection() {
    this.isSelected = !this.isSelected;
    this.draw();
  }

  public disableSelection() {
    this.canBeSelected = false;
  }
}
