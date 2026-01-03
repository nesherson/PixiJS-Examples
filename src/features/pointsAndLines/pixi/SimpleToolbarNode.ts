import { Container } from 'pixi.js';
import { ButtonNode, type ButtonNodeOptions } from './ButtonNode';
import { CheckboxNode } from './CheckboxNode';
import { RangeSliderNode, type RangeSliderOptions } from './RangeSliderNode';

interface SimpleToolbarNodeOptions {
  x: number;
  y: number;
}

export class SimpleToolbarNode extends Container {
  constructor({ x, y }: SimpleToolbarNodeOptions) {
    super({ x, y });
  }

  public addButton(
    text: string,
    onClick: () => void,
    settings: ButtonNodeOptions = {},
  ) {
    const lastItem = this.children[this.children.length - 1];
    const button = new ButtonNode({
      ...settings,
      text,
      padding: 10,
    });

    button.x = lastItem ? lastItem.x + lastItem.width + 10 : 0;

    button.on('click', onClick);

    this.addChild(button);

    return this;
  }

  public addCheckbox(text: string, onChange: (checked: boolean) => void) {
    const lastItem = this.children[this.children.length - 1];
    const showOrderCb = new CheckboxNode({
      x: lastItem ? lastItem.x + lastItem.width + 10 : 0,
      y: this.height * 0.2,
      text: text,
    });

    showOrderCb.onCheckedChanged = onChange;

    this.addChild(showOrderCb);

    return this;
  }

  public addSlider(options: RangeSliderOptions = {}) {
    const lastItem = this.children[this.children.length - 1];
    const slider = new RangeSliderNode({
      ...options,
      x: lastItem ? lastItem.x + lastItem.width + 10 : 0,
      y: 0,
    });

    this.addChild(slider);

    return this;
  }
}
