import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { GettingStartedApp } from './pixi/GettingStartedApp';

export function GettingStarted() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<GettingStartedApp | null>(null);
  const isInitializingRef = useRef(false);

  const [bunnyTwoMoveSpeed, setBunnyTwoMoveSpeed] = useState(1);
  const [bunnyThreeRotationSpeed, setBunnyThreeRotationSpeed] = useState(0.1);
  const [bunnyFourRotationSpeed, setBunnyFourRotationSpeed] = useState(0.1);

  const handleBunnyTwoMoveSpeedChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number(event.target.value);

    setBunnyTwoMoveSpeed(value);
    appRef.current?.setBunnyTwoMoveSpeed(value);
  };

  const handleBunnyThreeRotationSpeedChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number(event.target.value);

    setBunnyThreeRotationSpeed(value);
    appRef.current?.setBunnyThreeRotationSpeed(value);
  };

  const handleBunnyFourRotationSpeedChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number(event.target.value);

    setBunnyFourRotationSpeed(value);
    appRef.current?.setBunnyFourRotationSpeed(value);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (!isInitializingRef.current) {
      const instance = new GettingStartedApp(containerRef.current);

      appRef.current = instance;

      const init = async () => {
        try {
          isInitializingRef.current = true;
          await instance.initialize({
            background: '#ecf0f1',
            resizeTo: containerRef.current!,
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
        appRef.current?.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <p className="text-slate-600 mb-3">This is simple initial project</p>
      <div className="flex gap-2.5">
        <div className="flex flex-col mb-3">
          <label htmlFor="bunny-2-move-speed">Bunny 2 move speed:</label>
          <input
            id="bunny-2-move-speed"
            type="range"
            min="1"
            max="10"
            step="1"
            value={bunnyTwoMoveSpeed}
            onChange={handleBunnyTwoMoveSpeedChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="bunny-3-rotation-speed">
            Bunny 3 rotation speed:
          </label>
          <input
            id="bunny-3-rotation-speed"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={bunnyThreeRotationSpeed}
            onChange={handleBunnyThreeRotationSpeedChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="bunny-4-rotation-speed">
            Bunny 4 rotation speed:
          </label>
          <input
            id="bunny-4-rotation-speed"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={bunnyFourRotationSpeed}
            onChange={handleBunnyFourRotationSpeedChange}
          />
        </div>
      </div>
      <div className="h-200">
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="mt-2">
        <p>Use sliders to control the speed of the animation.</p>
        <p>Bunny 1 changes scaling on click.</p>
        <p>Bunny 5 can be dragged and dropped.</p>
      </div>
    </>
  );
}
