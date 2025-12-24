import { Container } from 'pixi.js';
import { ButtonNode } from './ButtonNode';

interface IButtonContainerNode {
  x: number;
  y: number;
}

export class ButtonContainerNode extends Container {
  constructor({ x, y }: IButtonContainerNode) {
    super({ x, y });
  }

  public addButton(text: string, onClick: () => void) {
    const lastButton = this.children[this.children.length - 1];
    const button = new ButtonNode({
      textFontSize: 16,
      text,
      padding: 10,
    });

    button.x = lastButton ? lastButton.x + lastButton.width + 10 : 0;

    button.on('click', onClick);

    this.addChild(button);

    return this;
  }
}
