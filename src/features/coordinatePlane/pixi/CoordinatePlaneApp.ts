import {
  Application,
  Assets,
  Container,
  FederatedPointerEvent,
  FederatedWheelEvent,
  Graphics,
  Sprite,
} from "pixi.js";
import type { IPixiApplication } from "@/features/pixiCanvas";

export class CoordinatePlaneApp implements IPixiApplication {
  public app: Application;

  private container: HTMLDivElement;
  private zoomFactor = 1.05;
  private world: Container;
  private isDragging: boolean = false;
  private lastPos: { x: number; y: number } = { x: 0, y: 0 };

  constructor(container: HTMLDivElement) {
    this.app = new Application();
    this.container = container;
    this.world = new Container();
  }

  async init() {
    await this.app.init({
      background: "#ecf0f1",
      width: 1200,
      height: 820,
      antialias: true,
    });

    this.container.appendChild(this.app.canvas);

    const texture = await Assets.load("https://pixijs.com/assets/bunny.png");

    this.app.stage.eventMode = "static";
    this.app.stage.hitArea = this.app.screen;

    // this.app.stage.x = this.app.screen.width / 2;
    // this.app.stage.y = this.app.screen.height / 2;

    this.app.stage.on("pointerdown", this.stagePointerDown);
    this.app.stage.on("pointermove", this.stagePointerMove);
    this.app.stage.on("pointerup", this.stagePointerUp);
    this.app.stage.on("pointerupoutside", this.stagePointerUpOutside);
    this.app.stage.on("wheel", this.stageWheel);

    const centerPoint = new Graphics()
      .clear()
      .setFillStyle({ color: 0xff0000 })
      .circle(0, 0, 3)
      .fill();
    const spriteOne = new Sprite(texture);
    spriteOne.anchor = 0.5;
    spriteOne.x = 200;
    spriteOne.y = 200;

    const spriteTwo = new Sprite(texture);
    spriteTwo.anchor = 0.5;
    spriteTwo.x = -200;
    spriteTwo.y = -200;

    this.world.addChild(centerPoint, spriteOne, spriteTwo);
    this.app.stage.addChild(this.world);
  }

  destroy() {
    this.app.destroy(true, { children: true });
  }

  private stagePointerDown = (e: FederatedPointerEvent) => {
    this.isDragging = true;
    this.lastPos = { x: e.global.x, y: e.global.y };
  };

  private stagePointerMove = (e: FederatedPointerEvent) => {
    console.log(`e.global.x -> ${e.global.x}, e.global.y -> ${e.global.y}, `);
    // console.log(`e.clientX -> ${e.clientX}, e.clientY -> ${e.clientY}, `);
    const test = this.world.toLocal({ x: e.clientX, y: e.clientY });

    console.log(
      `this.world.toLocal.x -> ${test.x}, this.world.toLocal.y -> ${test.y}, `,
    );
    if (!this.isDragging) return;

    const currentPos = { x: e.global.x, y: e.global.y };

    const offsetX = currentPos.x - this.lastPos.x;
    const offsetY = currentPos.y - this.lastPos.y;

    this.world.position.x += offsetX;
    this.world.position.y += offsetY;

    this.lastPos = currentPos;
  };

  private stagePointerUp = () => {
    this.isDragging = false;
  };

  private stagePointerUpOutside = () => {
    this.isDragging = false;
  };

  private stageWheel = (e: FederatedWheelEvent) => {
    e.preventDefault();

    const localPosBefore = this.world.toLocal({ x: e.clientX, y: e.clientY });
    const direction = e.deltaY > 0 ? 1 / this.zoomFactor : this.zoomFactor;

    this.world.scale.x *= direction;
    this.world.scale.y *= direction;

    const newScreenPos = this.world.toGlobal(localPosBefore);

    this.world.position.x -= newScreenPos.x - e.clientX;
    this.world.position.y -= newScreenPos.y - e.clientY;
  };
}
