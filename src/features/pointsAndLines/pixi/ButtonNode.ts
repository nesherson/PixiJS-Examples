import { Container, Graphics, Text, TextStyle } from 'pixi.js';

interface ButtonNodeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  text: string;
  textFontSize?: number;
  padding?: number;
  textColor?: string;
}

export class ButtonNode extends Container {
  public isSelected = false;
  private radius: number = 3;
  private rectangleWidth = 0;
  private rectangleHeight = 0;
  private text: Text;
  private padding?: number;

  constructor({
    x = 0,
    y = 0,
    width,
    height,
    radius = 5,
    text,
    textFontSize,
    padding,
    textColor = '#ffffff',
  }: ButtonNodeProps) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.text = new Text({
      text: text,
      style: new TextStyle({ fontSize: textFontSize ?? 12, fill: textColor }),
    });
    this.rectangleWidth = width ?? 100;
    this.rectangleHeight = height ?? 30;
    this.padding = padding;
    this.eventMode = 'static';
    this.cursor = 'pointer';

    if (this.padding) {
      this.rectangleWidth = this.text.width + this.padding * 2;
      this.rectangleHeight = this.text.height + this.padding * 2;
      this.text.x = this.padding;
      this.text.y = this.padding;
    }

    this.draw();
  }

  public draw() {
    const rectangle = new Graphics()
      .roundRect(0, 0, this.rectangleWidth, this.rectangleHeight, this.radius)
      .fill('#6da2f7');

    this.addChild(rectangle);
    this.addChild(this.text);
  }
}
