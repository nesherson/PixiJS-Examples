import {
  Application,
  Assets,
  FederatedPointerEvent,
  Sprite,
  type Texture,
  type Ticker,
} from "pixi.js";

export class GettingStartedApp {
  private bunnyTwoMoveSpeed = 1;
  private bunnyTwoDirection = 1;
  private bunnyThreeRotationSpeed = 0.1;
  private bunnyFourAngle = 0;
  private bunnyFourRadius = 50;
  private bunnyFourRotationSpeed = 0.1;
  private bunnyOne!: Sprite;
  private bunnyTwo!: Sprite;
  private bunnyThree!: Sprite;
  private bunnyFour!: Sprite;

  public app: Application;

  constructor() {
    this.app = new Application();
  }

  async init() {
    await this.app.init({
      background: "#1099bb",
      width: 800,
      height: 600,
    });
    await this.createBunnies();
    this.app.ticker.add(this.update.bind(this));
  }

  async createBunnies() {
    const texture: Texture = await Assets.load(
      "https://pixijs.com/assets/bunny.png"
    );

    this.bunnyOne = this.createBunny(
      this.app.screen.width * 0.2,
      this.app.screen.height * 0.2,
      texture
    );
    this.bunnyTwo = this.createBunny(
      this.app.screen.width * 0.8,
      this.app.screen.height * 0.2,
      texture
    );
    this.bunnyThree = this.createBunny(
      this.app.screen.width * 0.2,
      this.app.screen.height * 0.8,
      texture
    );
    this.bunnyFour = this.createBunny(
      this.app.screen.width * 0.8,
      this.app.screen.height * 0.8,
      texture
    );

    this.bunnyOne.eventMode = "static";
    this.bunnyOne.on("click", this.bunnyOneClick);

    this.app.stage.addChild(this.bunnyOne);
    this.app.stage.addChild(this.bunnyTwo);
    this.app.stage.addChild(this.bunnyThree);
    this.app.stage.addChild(this.bunnyFour);
  }

  setBunnyTwoMoveSpeed(moveSpeed: number) {
    this.bunnyTwoMoveSpeed = moveSpeed;
  }

  setBunnyThreeRotationSpeed(rotationSpeed: number) {
    this.bunnyThreeRotationSpeed = rotationSpeed;
  }

  setBunnyFourRotationSpeed(rotationSpeed: number) {
    this.bunnyFourRotationSpeed = rotationSpeed;
  }

  destroy() {
    if (this.app.renderer) {
      this.app.destroy({ removeView: true });
    }
  }

  private update(time: Ticker) {
    this.bunnyFourAngle =
      this.bunnyFourAngle + this.bunnyFourRotationSpeed * time.deltaTime;

    if (this.bunnyTwo.x >= this.app.screen.width * 0.9) {
      this.bunnyTwoDirection = -1;
    } else if (this.bunnyTwo.x <= this.app.screen.width * 0.7) {
      this.bunnyTwoDirection = 1;
    }

    this.bunnyTwo.x +=
      this.bunnyTwoDirection * time.deltaTime * this.bunnyTwoMoveSpeed;
    this.bunnyThree.rotation +=
      this.bunnyThreeRotationSpeed * time.deltaTime;
    this.bunnyFour.x =
      this.app.screen.width * 0.8 +
      Math.cos(this.bunnyFourAngle) * this.bunnyFourRadius;
    this.bunnyFour.y =
      this.app.screen.height * 0.8 +
      Math.sin(this.bunnyFourAngle) * this.bunnyFourRadius;
  }

  private createBunny(x: number, y: number, texture: Texture) {
    const bunny = new Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.x = x;
    bunny.y = y;

    return bunny;
  }

  private bunnyOneClick(e: FederatedPointerEvent) {
    const sprite = e.currentTarget as Sprite;

    if (sprite.scale.x === 1 && sprite.scale.y === 1) {
      sprite.scale.x = 1.5;
      sprite.scale.y = 1.5;
    } else {
      sprite.scale.x = 1;
      sprite.scale.y = 1;
    }
  }
}
