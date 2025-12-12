import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export class ButtonNode extends Container {
  public isSelected: boolean = false;
  private radius: number = 3;
  private rectangleWidth: number = 0;
  private rectangleHeight: number = 0;
  private text: string = '';

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number = 5,
    text: string,
  ) {
    super();
    this.x = x;
    this.y = y;
    this.rectangleWidth = this.width = width;
    this.rectangleHeight = this.height = height;
    this.radius = radius;
    this.text = text;
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.draw();
  }

  public draw() {
    const rectangle = new Graphics()
      .roundRect(0, 0, this.rectangleWidth, this.rectangleHeight, this.radius)
      .fill('#6da2f7');
    const text = new Text({
      text: this.text,
      style: new TextStyle({ fontSize: 14 }),
    });

    text.anchor = 0.5;
    text.x = this.rectangleWidth / 2;
    text.y = this.rectangleHeight / 2;

    this.addChild(rectangle);
    this.addChild(text);
  }
}
