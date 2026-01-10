import {
  Application,
  Assets,
  Container,
  FederatedPointerEvent,
  Rectangle,
  Sprite,
  TextStyle,
  Texture,
  Ticker,
  Text,
  type ApplicationOptions,
} from 'pixi.js';

export class GettingStartedApp extends Application {
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
  private bunnyFive!: Container;
  private isDraggingBunnyFive = false;

  constructor(container: HTMLDivElement) {
    super();
    this.container = container;
  }

  public async initialize(options?: Partial<ApplicationOptions>) {
    await this.init(options);
    this.stage.eventMode = 'static';
    this.stage.hitArea = new Rectangle(
      0,
      0,
      this.screen.width,
      this.screen.height,
    );
    this.stage.on('pointermove', this.stagePointerMove);
    this.stage.on('pointerup', this.stagePointerUp);

    this.container.appendChild(this.canvas);
    await this.createBunnies();
    this.ticker.add(this.animate);
  }

  async createBunnies() {
    const texture: Texture = await Assets.load(
      'https://pixijs.com/assets/bunny.png',
    );

    this.bunnyOne = this.createBunny(
      this.screen.width * 0.2,
      this.screen.height * 0.2,
      texture,
      'Bunny 1',
    );
    this.bunnyTwo = this.createBunny(
      this.screen.width * 0.8,
      this.screen.height * 0.2,
      texture,
      'Bunny 2',
    );
    this.bunnyThree = this.createBunny(
      this.screen.width * 0.2,
      this.screen.height * 0.8,
      texture,
      'Bunny 3',
    );
    this.bunnyFour = this.createBunny(
      this.screen.width * 0.8,
      this.screen.height * 0.8,
      texture,
      'Bunny 4',
    );
    this.bunnyFive = this.createBunny(
      this.screen.width * 0.5,
      this.screen.height * 0.5,
      texture,
      'Bunny 5',
    );

    this.bunnyOne.eventMode = 'static';
    this.bunnyOne.on('click', this.bunnyOneClick);
    this.bunnyFive.eventMode = 'dynamic';
    this.bunnyFive.on('pointerdown', this.bunnyFivePointerDown);
    this.stage.addChild(
      this.bunnyOne,
      this.bunnyTwo,
      this.bunnyThree,
      this.bunnyFour,
      this.bunnyFive,
    );
  }

  private animate = (time: Ticker) => {
    this.bunnyFourAngle =
      this.bunnyFourAngle + this.bunnyFourRotationSpeed * time.deltaTime;

    if (this.bunnyTwo.x >= this.screen.width * 0.9) {
      this.bunnyTwoDirection = -1;
    } else if (this.bunnyTwo.x <= this.screen.width * 0.7) {
      this.bunnyTwoDirection = 1;
    }

    this.bunnyTwo.x +=
      this.bunnyTwoDirection * time.deltaTime * this.bunnyTwoMoveSpeed;

    const bunnyThreeSprite = this.bunnyThree.getChildByLabel(
      'bunny-sprite',
    ) as Sprite;

    bunnyThreeSprite.rotation += this.bunnyThreeRotationSpeed * time.deltaTime;

    this.bunnyFour.x =
      this.screen.width * 0.8 +
      Math.cos(this.bunnyFourAngle) * this.bunnyFourRadius;
    this.bunnyFour.y =
      this.screen.height * 0.8 +
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

  public setBunnyTwoMoveSpeed(speed: number) {
    this.bunnyTwoMoveSpeed = speed;
  }

  public setBunnyThreeRotationSpeed(speed: number) {
    this.bunnyThreeRotationSpeed = speed;
  }

  public setBunnyFourRotationSpeed(speed: number) {
    this.bunnyFourRotationSpeed = speed;
  }

  private bunnyOneClick = (e: FederatedPointerEvent) => {
    const container = e.currentTarget as Container;
    if (container.scale.x === 1 && container.scale.y === 1) {
      container.scale.x = 1.5;
      container.scale.y = 1.5;
    } else {
      container.scale.x = 1;
      container.scale.y = 1;
    }
  };

  private bunnyFivePointerDown = () => {
    this.isDraggingBunnyFive = true;
  };

  private stagePointerMove = (e: FederatedPointerEvent) => {
    if (this.isDraggingBunnyFive) {
      this.bunnyFive.x = e.global.x;
      this.bunnyFive.y = e.global.y;
    }
  };

  private stagePointerUp = () => {
    if (this.isDraggingBunnyFive) {
      this.isDraggingBunnyFive = false;
    }
  };
}
