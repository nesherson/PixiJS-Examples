import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export interface ButtonNodeOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  textFontSize?: number;
  padding?: number;
  textColor?: string;
  backgroundColor?: string;
}

export class ButtonNode extends Container {
  // Public properties
  public isSelected = false;

  // Private properties
  private _radius: number = 3;
  private _rectangleWidth = 0;
  private _rectangleHeight = 0;
  private _label: Text;
  private _background: Graphics;
  private _padding?: number;
  private _backgroundColor: string;

  constructor(options: ButtonNodeOptions) {
    super();

    const {
      x = 0,
      y = 0,
      width = 100,
      height = 30,
      radius = 5,
      text = '',
      textFontSize = 12,
      padding,
      textColor = '#ffffff',
      backgroundColor = '#6da2f7',
    } = options;

    this.x = x;
    this.y = y;
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this._radius = radius;
    this._rectangleWidth = width ?? 100;
    this._rectangleHeight = height ?? 30;
    this._padding = padding;
    this._backgroundColor = backgroundColor;

    this._background = new Graphics();
    this._label = new Text({
      text: text,
      style: new TextStyle({ fontSize: textFontSize, fill: textColor }),
    });

    this.addChild(this._background);
    this.addChild(this._label);

    this.recalculateLayout();
    this.draw();
  }

  public draw() {
    this._background
      .clear()
      .roundRect(
        0,
        0,
        this._rectangleWidth,
        this._rectangleHeight,
        this._radius,
      )
      .fill(this._backgroundColor);
  }

  private recalculateLayout() {
    if (this._padding) {
      this._rectangleWidth = this._label.width + this._padding * 2;
      this._rectangleHeight = this._label.height + this._padding * 2;
      this._label.x = this._padding;
      this._label.y = this._padding;
    } else {
      this._label.anchor.set(0.5);
      this._label.x = this._rectangleWidth / 2;
      this._label.y = this._rectangleHeight / 2;
    }
  }
}
