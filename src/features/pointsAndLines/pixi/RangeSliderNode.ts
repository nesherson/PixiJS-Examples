import { getStage } from '@/utils/pixi';
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
  stage?: Container;
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
  private _dragging: boolean = false;
  private _handle: Graphics;
  private _track: Graphics;
  private _text?: Text;

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

    this._handle = new Graphics();
    this._track = new Graphics();

    this.updateHandlePosition();

    this.addChild(this._track);

    this.draw();
    this.initHandle();
    this.initText(options.text ?? '');

    this._track.eventMode = 'static';
    this._track.cursor = 'pointer';

    this._track.on('pointerdown', this.onTrackDown);
  }

  public get value(): number {
    return this._value;
  }

  public set value(newValue: number) {
    this._value = Math.max(this.min, Math.min(this.max, newValue));
    this.updateHandlePosition();
    this.draw();
    this.onValueChange(this._value);
  }

  private initHandle() {
    this._handle.eventMode = 'static';
    this._handle.cursor = 'grab';

    this._handle
      .circle(0, 0, this.handleRadius)
      .fill(this.handleColor)
      .stroke(this.handleBorderColor);

    this._handle.on('pointerdown', this.onDragStart, this);

    this.addChild(this._handle);
    this.updateHandlePosition();
  }

  private initText(text: string) {
    this._text = new Text({
      text: text,
      x: this.sliderWidth / 2,
      y: -16,
      style: new TextStyle({ fontSize: 12 }),
    });
    this._text.anchor.set(0.5);

    this.addChild(this._text);
  }

  private draw() {
    this._track
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

    const activeWidth = this._handle.x;

    if (activeWidth > 0) {
      this._track
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

  private updateHandlePosition() {
    const range = this.max - this.min;
    const percent = (this._value - this.min) / range;
    this._handle.x = percent * this.sliderWidth;
    this._handle.y = 0;
  }

  private onDragStart(event: FederatedPointerEvent) {
    event.stopPropagation();

    this._dragging = true;
    this._handle.cursor = 'grabbing';
    this._handle.alpha = 0.8;

    const localPos = event.getLocalPosition(this);
    const stage = getStage(this);

    this.updateValueFromX(localPos.x);

    if (stage) {
      stage.on('pointermove', this.onDragMove);
      stage.on('pointerup', this.onDragEnd);
    }
  }

  private onDragEnd = () => {
    this._dragging = false;
    this._handle.cursor = 'grab';
    this._handle.alpha = 1;

    const stage = getStage(this);

    if (stage) {
      stage.off('pointermove', this.onDragMove);
      stage.off('pointerup', this.onDragEnd);
    }
  };

  private onDragMove = (event: FederatedPointerEvent) => {
    if (!this._dragging) return;

    const localPos = event.getLocalPosition(this);

    this.updateValueFromX(localPos.x);
  };

  private onTrackDown = (event: FederatedPointerEvent) => {
    const localPos = event.getLocalPosition(this);

    this.updateValueFromX(localPos.x);
    this.onDragStart(event);
  };

  private updateValueFromX(x: number) {
    const clampedX = Math.max(0, Math.min(this.sliderWidth, x));
    const percent = clampedX / this.sliderWidth;
    const range = this.max - this.min;
    const newValue = this.min + range * percent;

    this.value = newValue;
  }
}
