import { Container, Graphics, Rectangle, TextStyle, Text } from 'pixi.js';

interface ICheckboxNode {
  checked?: boolean;
  x: number;
  y: number;
  text?: string;
}

export class CheckboxNode extends Container {
  public onCheckedChanged?: (checked: boolean) => void;

  private checked: boolean;
  private checkMark?: Graphics | null;
  private box?: Graphics | null;
  private text?: string;
  private textBlock?: Text;

  constructor({ checked = false, x = 0, y = 0, text }: ICheckboxNode) {
    super();
    this.x = x;
    this.y = y;
    this.checked = checked;
    this.text = text;
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.on('click', this.toggle);
    this.hitArea = new Rectangle(0, 0, 20, 20);

    this.draw();
  }

  private toggle() {
    this.checked = !this.checked;
    this.onCheckedChanged?.(this.checked);
    this.draw();
  }

  public draw() {
    this.box = new Graphics()
      .roundRect(0, 0, 20, 20, 5)
      .stroke({ color: '#000000', width: 2 });

    if (this.text && !this.textBlock) {
      this.textBlock = new Text({
        text: this.text,
        style: new TextStyle({ fontSize: 13, fill: '#000000' }),
        x: this.box.width + 5,
        y: this.box.height / 2 - 6,
      });

      this.addChild(this.textBlock);
    }

    if (this.checked) {
      this.checkMark = new Graphics()
        .poly([5, 10, 10, 15, 15, 5], false)
        .stroke({ color: '#000000', width: 2 });

      this.addChild(this.checkMark);
    } else {
      this.checkMark?.destroy();
      this.checkMark = null;
    }

    this.addChild(this.box);
  }
}
