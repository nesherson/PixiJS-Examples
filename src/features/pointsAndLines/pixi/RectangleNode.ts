import { Graphics } from "pixi.js";

export class RectangleNode extends Graphics {
  public rectWidth: number = 0;
  public rectHeight: number = 0;

  constructor(x: number, y: number, width: number, height: number) {
    super();

    this.x = x;
    this.y = y;
    this.rectWidth = width;
    this.rectHeight = height;
    this.label = "rectangle-node";

    this.draw();
  }

  public draw = () => {
    this.clear();
    this.rect(0, 0, this.rectWidth, this.rectHeight).stroke({ width: 2, color: "#000000" });
  };
}
