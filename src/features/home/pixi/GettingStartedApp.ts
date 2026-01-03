import {
  Application,
  Assets,
  Container,
  FederatedPointerEvent,
  Sprite,
  Text,
  TextStyle,
  type Texture,
  type Ticker,
} from 'pixi.js';

import { type IPixiApplication } from '@/features/pixiCanvas';
import { SimpleToolbarNode } from '@/features/pointsAndLines/pixi/SimpleToolbarNode';

export interface GettingStartedAppUpdateProps {
  bunnyTwoMoveSpeed: number;
  bunnyThreeRotationSpeed: number;
  bunnyFourRotationSpeed: number;
}

export class GettingStartedApp implements IPixiApplication {
  public app: Application;
  private container: HTMLDivElement;
  private bunnyTwoMoveSpeed = 1;
  private bunnyTwoDirection = 1;
  private bunnyThreeRotationSpeed = 0.1;
  private bunnyFourAngle = 0;
  private bunnyFourRadius = 50;
  private bunnyFourRotationSpeed = 0.1;
  private bunnyOne!: Container;
  private bunnyTwo!: Container;
  private bunnyThree!: Container;
  private bunnyFour!: Container;

  constructor(container: HTMLDivElement) {
    this.app = new Application();
    this.container = container;
  }

  async init() {
    await this.app.init({
      background: '#1099bb',
      width: 800,
      height: 600,
    });
    this.container.appendChild(this.app.canvas);
    await this.createBunnies();
    this.addToolbar();
    this.app.ticker.add(this.animate);
  }

  destroy() {
    this.app.destroy(true, { children: true });
  }

  private addToolbar() {
    const toolbar = new SimpleToolbarNode({
      x: this.app.screen.width * 0.02,
      y: this.app.screen.height * 0.07,
    })
      .addSlider({
        min: 0,
        max: 10,
        value: 5,
        width: 200,
        height: 8,
        text: 'Bunny 2 Move Speed',
        onChange: (value) => {
          this.bunnyTwoMoveSpeed = value;
        },
      })
      .addSlider({
        min: 0.1,
        max: 1,
        value: 0.5,
        width: 200,
        height: 8,
        text: 'Bunny 3 Rotation Speed',
        onChange: (value) => {
          this.bunnyThreeRotationSpeed = value;
        },
      })
      .addSlider({
        min: 0.1,
        max: 1,
        value: 0.5,
        width: 200,
        height: 8,
        text: 'Bunny 4 Rotation Speed',
        onChange: (value) => {
          this.bunnyFourRotationSpeed = value;
        },
      });

    this.app.stage.addChild(toolbar);
  }

  async createBunnies() {
    const texture: Texture = await Assets.load(
      'https://pixijs.com/assets/bunny.png',
    );

    this.bunnyOne = this.createBunny(
      this.app.screen.width * 0.2,
      this.app.screen.height * 0.2,
      texture,
      'Bunny 1',
    );
    this.bunnyTwo = this.createBunny(
      this.app.screen.width * 0.8,
      this.app.screen.height * 0.2,
      texture,
      'Bunny 2',
    );
    this.bunnyThree = this.createBunny(
      this.app.screen.width * 0.2,
      this.app.screen.height * 0.8,
      texture,
      'Bunny 3',
    );
    this.bunnyFour = this.createBunny(
      this.app.screen.width * 0.8,
      this.app.screen.height * 0.8,
      texture,
      'Bunny 4',
    );

    this.bunnyOne.eventMode = 'static';
    this.bunnyOne.on('click', this.bunnyOneClick);
    this.app.stage.addChild(
      this.bunnyOne,
      this.bunnyTwo,
      this.bunnyThree,
      this.bunnyFour,
    );
  }

  private animate = (time: Ticker) => {
    this.bunnyFourAngle =
      this.bunnyFourAngle + this.bunnyFourRotationSpeed * time.deltaTime;

    if (this.bunnyTwo.x >= this.app.screen.width * 0.9) {
      this.bunnyTwoDirection = -1;
    } else if (this.bunnyTwo.x <= this.app.screen.width * 0.7) {
      this.bunnyTwoDirection = 1;
    }

    this.bunnyTwo.x +=
      this.bunnyTwoDirection * time.deltaTime * this.bunnyTwoMoveSpeed;

    const bunnyThreeSprite = this.bunnyThree.getChildByLabel(
      'bunny-sprite',
    ) as Sprite;

    bunnyThreeSprite.rotation +=
      this.bunnyThreeRotationSpeed * time.deltaTime;

    this.bunnyFour.x =
      this.app.screen.width * 0.8 +
      Math.cos(this.bunnyFourAngle) * this.bunnyFourRadius;
    this.bunnyFour.y =
      this.app.screen.height * 0.8 +
      Math.sin(this.bunnyFourAngle) * this.bunnyFourRadius;
  };

  private createBunny(x: number, y: number, texture: Texture, name: string) {
    const bunnyContainer = new Container();
    const bunny = new Sprite(texture);
    const textStyle = new TextStyle({ fontSize: 14 });
    const bunnyText = new Text({ text: name, style: textStyle });

    bunny.label = 'bunny-sprite';
    bunny.anchor.set(0.5);
    bunnyContainer.x = x;
    bunnyContainer.y = y;
    bunnyText.x -= bunny.width;
    bunnyText.y -= bunny.height + 5;

    bunnyContainer.addChild(bunny);
    bunnyContainer.addChild(bunnyText);

    return bunnyContainer;
  }

  private bunnyOneClick(e: FederatedPointerEvent) {
    const container = e.currentTarget as Container;

    if (container.scale.x === 1 && container.scale.y === 1) {
      container.scale.x = 1.5;
      container.scale.y = 1.5;
    } else {
      container.scale.x = 1;
      container.scale.y = 1;
    }
  }
}
