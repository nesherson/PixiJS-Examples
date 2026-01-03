import {
  FederatedPointerEvent,
  Graphics,
  TextStyle,
  Text,
  Container,
} from 'pixi.js';

export interface RangeSliderOptions {
  x?: number;
  y?: number;
  min?: number;
  max?: number;
  value?: number;
  width?: number;
  height?: number;
  handleRadius?: number;
  onChange?: (value: number) => void;
  text?: string;
}

export class RangeSliderNode extends Container {
  public min: number;
  public max: number;
  public sliderWidth: number;
  public sliderHeight: number;
  public handleRadius: number;
  public onValueChange: (value: number) => void;

  public trackColor: number = 0xdddddd;
  public fillColor: number = 0x3e89f5;
  public handleColor: number = 0xffffff;
  public borderColor: number = 0x333333;
  public handleBorderColor: number = 0x999999;

  private _value: number;
  private dragging: boolean = false;
  private handle: Graphics;
  private track: Graphics;
  private text?: Text;

  constructor(options: RangeSliderOptions = {}) {
    super();

    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
    this.min = options.min ?? 0;
    this.max = options.max ?? 100;
    this._value = options.value ?? this.min;
    this.sliderWidth = options.width ?? 200;
    this.sliderHeight = options.height ?? 10;
    this.handleRadius = options.handleRadius ?? 10;
    this.onValueChange = options.onChange ?? (() => {});

    this.handle = new Graphics();
    this.track = new Graphics();

    this._updateHandlePosition();

    this.addChild(this.track);

    this._draw();
    this._initHandle();
    this._initText(options.text ?? '');

    this.track.eventMode = 'static';
    this.track.cursor = 'pointer';

    this.track.on('pointerdown', this._onTrackDown, this);
  }

  public get value(): number {
    return this._value;
  }

  public set value(newValue: number) {
    this._value = Math.max(this.min, Math.min(this.max, newValue));
    this._updateHandlePosition();
    this._draw();
    this.onValueChange(this._value);
  }

  private _initHandle() {
    this.handle.eventMode = 'static';
    this.handle.cursor = 'grab';

    this.handle
      .circle(0, 0, this.handleRadius)
      .fill(this.handleColor)
      .stroke(this.handleBorderColor);

    this.handle.on('pointerdown', this._onDragStart, this);
    this.handle.on('pointermove', this._onDragMove, this);
    this.handle.on('pointerup', this._onDragEnd, this);

    this.addChild(this.handle);
    this._updateHandlePosition();
  }

  private _initText(text: string) {
    this.text = new Text({
      text: text,
      x: this.sliderWidth / 2,
      y: this.y - this.handle.height,
      style: new TextStyle({ fontSize: 12 }),
    });
    this.text.anchor.set(0.5);

    this.addChild(this.text);
  }

  private _draw() {
    this.track
      .clear()
      .roundRect(
        0,
        -this.sliderHeight / 2,
        this.sliderWidth,
        this.sliderHeight,
        5,
      )
      .fill(this.trackColor)
      .stroke({ color: this.borderColor, width: 1 });

    const activeWidth = this.handle.x;

    if (activeWidth > 0) {
      this.track
        .roundRect(
          1,
          -this.sliderHeight / 2 + 1,
          activeWidth - 1,
          this.sliderHeight - 1,
          5,
        )
        .fill(this.fillColor);
    }
  }

  private _updateHandlePosition() {
    const range = this.max - this.min;
    const percent = (this._value - this.min) / range;
    this.handle.x = percent * this.sliderWidth;
    this.handle.y = 0;
  }

  private _onDragStart(event: FederatedPointerEvent) {
    event.stopPropagation();

    this.dragging = true;
    this.handle.cursor = 'grabbing';
    this.handle.alpha = 0.8;

    const localPos = event.getLocalPosition(this);

    this._updateValueFromX(localPos.x);
  }

  private _onDragEnd = () => {
    this.dragging = false;
    this.handle.cursor = 'grab';
    this.handle.alpha = 1;
  };

  private _onDragMove = (event: FederatedPointerEvent) => {
    if (!this.dragging) return;
    if (!this.parent) return;

    const localPos = event.getLocalPosition(this);

    this._updateValueFromX(localPos.x);
  };

  private _onTrackDown(event: FederatedPointerEvent) {
    const localPos = event.getLocalPosition(this);

    this._updateValueFromX(localPos.x);
    this._onDragStart(event);
  }

  private _updateValueFromX(x: number) {
    const clampedX = Math.max(0, Math.min(this.sliderWidth, x));
    const percent = clampedX / this.sliderWidth;
    const range = this.max - this.min;
    const newValue = this.min + range * percent;

    this.value = newValue;
  }
}
