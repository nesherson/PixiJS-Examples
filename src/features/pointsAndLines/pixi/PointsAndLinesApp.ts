import {
  Application,
  FederatedPointerEvent,
  Graphics,
  Rectangle,
  TextStyle,
  Text,
  Container,
} from "pixi.js";

import { PointNode } from "./PointNode";

export class PointsAndLinesApp {
  public app: Application;

  private selectedPoints: Set<PointNode> = new Set();

  constructor() {
    this.app = new Application();
  }

  async init() {
    await this.app.init({
      background: "#ecf0f1",
      width: 1200,
      height: 820,
    });

    this.app.stage.eventMode = "static";
    this.app.stage.hitArea = new Rectangle(
      0,
      0,
      this.app.screen.width,
      this.app.screen.height
    );
    this.app.stage.on("click", this.onStageClick);

    this.addButtons();
  }

  private addButtons = () => {
    const drawStraighLinesBtnContainer = new Container();
    const drawStraightLinesBtn = new Graphics()
      .roundRect(0, 0, 120, 35, 5)
      .fill("#6da2f7");
    const drawStraightLinesBtnText = new Text({
      text: "Draw straight",
      style: new TextStyle({ fontSize: 14 }),
    });

    drawStraighLinesBtnContainer.x = 20;
    drawStraighLinesBtnContainer.y = 10;
    drawStraightLinesBtnText.x = 10;
    drawStraightLinesBtnText.y = 10;

    drawStraightLinesBtn.eventMode = "static";
    drawStraightLinesBtn.cursor = "pointer";

    drawStraighLinesBtnContainer.addChild(drawStraightLinesBtn);
    drawStraighLinesBtnContainer.addChild(drawStraightLinesBtnText);

    this.app.stage.addChild(drawStraighLinesBtnContainer);
  };

  private onStageClick = (e: FederatedPointerEvent) => {
    if (e.target !== this.app.stage) return;

    const { x, y } = e.getLocalPosition(e.currentTarget);
    const point = new PointNode(x, y);

    point.on("click", this.onPointClick);

    this.app.stage.addChild(point);
  };

  private onPointClick = (e: FederatedPointerEvent) => {
    e.stopPropagation();

    const point = e.currentTarget as PointNode;

    point.toggleSelection();

    if (point.isSelected) {
      this.selectedPoints.add(point);
    } else {
      this.selectedPoints.delete(point);
    }
  };
}
