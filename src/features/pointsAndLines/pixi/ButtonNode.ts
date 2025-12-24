import { NineSliceSprite, Texture, Text } from 'pixi.js';

interface ButtonNodeSettings {
  width: number;
  height: number;
  fontSize: number;
  text: string;
  stroke: string;
}

export class ButtonNode extends NineSliceSprite {
  private settings: ButtonNodeSettings;
  private text: Text;

  constructor(settings: ButtonNodeSettings) {
    const texture = Texture.from('button');
    const notScalableArea = 20;
    super({
      texture,
      leftWidth: notScalableArea,
      rightWidth: notScalableArea,
      topHeight: notScalableArea,
      bottomHeight: notScalableArea,
    });

    this.settings = {
      width: 200,
      height: 100,
      fontSize: 35,
      text: 'button-node',
      stroke: '#336699',
      strokeThickness: 4,
    };

    this.text = new Text({ text: '' });
    this.addChild(this.text);

    this.update(settings);
  }

  update(settings: ButtonNodeSettings) {
    this.settings = {
      ...this.settings,
      ...settings,
    };

    this.text.text = this.settings.text;
    this.text.style = {
      fontSize: this.settings.fontSize + 'px',
      fill: '#ffffff',
      stroke: this.settings.stroke,
    };

    this.onResize();
  }

  onResize() {
    this.width = this.settings.width;
    this.height = this.settings.height;

    this.text.x = this.width * 0.5;
    this.text.y = this.height * 0.5;

    this.pivot.set(this.width * 0.5, this.height * 0.5);
  }
}
