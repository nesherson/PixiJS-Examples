import {
  Application,
  Assets,
  Sprite,
  Texture,
  type ApplicationOptions,
} from 'pixi.js';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';

class TestPixiApp extends Application {
  private container: HTMLDivElement;
  private bunnySprite: Sprite | null;
  private bunnyMoveSpeed: number = 0.5;

  constructor(container: HTMLDivElement) {
    super();
    this.container = container;
  }

  public async initialize(options?: Partial<ApplicationOptions>) {
    await this.init(options);
    this.container.appendChild(this.canvas);
    await this.addBunnies();

    // move bunny x in ticker
    this.ticker.add(() => {
      this.bunnySprite.x += 1 * this.bunnyMoveSpeed;
    });
  }

  public setBunnySpeed(speed: number) {
    if (!this.bunnySprite) return;

    this.bunnyMoveSpeed = speed;
  }

  private async addBunnies() {
    const texture: Texture = await Assets.load(
      'https://pixijs.com/assets/bunny.png',
    );

    const bunnySprite = new Sprite(texture);
    bunnySprite.x = this.screen.width / 2;
    bunnySprite.y = this.screen.height / 2;
    this.bunnySprite = bunnySprite;
    this.stage.addChild(bunnySprite);
  }
}

export function GettingStarted() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<TestPixiApp | null>(null);
  const isInitializingRef = useRef(false);

  const [speed, setSpeed] = useState(0);

  const handleSpeedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const tempSpeed = Number(event.target.value);

    setSpeed(tempSpeed);
    appRef.current?.setBunnySpeed(tempSpeed);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (!isInitializingRef.current) {
      const instance = new TestPixiApp(containerRef.current);

      appRef.current = instance;

      const init = async () => {
        try {
          isInitializingRef.current = true;
          await instance.initialize({
            width: 800,
            height: 600,
            backgroundColor: 0x1099bb,
          });
        } catch (e) {
          console.error('Pixi initialization failed', e);
        } finally {
          isInitializingRef.current = false;
        }
      };

      init();
    }

    return () => {
      if (!isInitializingRef.current) {
        appRef.current?.destroy();
        appRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <input
        type="range"
        min="1"
        max="100"
        value={speed}
        onChange={handleSpeedChange}
      />
      <p className="text-slate-600 mb-3">This is simple initial project</p>
      <div className="h-200">
        {/*<PixiCanvas applicationClass={GettingStartedApp} />*/}
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="mt-2">
        <p>Use sliders to control the speed of the animation.</p>
        <p>Bunny 5 can be dragged and dropped.</p>
      </div>
    </>
  );
}
