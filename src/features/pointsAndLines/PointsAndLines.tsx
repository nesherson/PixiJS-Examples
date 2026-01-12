import { useEffect, useRef, useState } from 'react';
import { PointsAndLinesApp } from './pixi/PointsAndLinesApp';

export function PointsAndLines() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PointsAndLinesApp | null>(null);
  const isInitializingRef = useRef(false);

  const [isAnimatingLines, setIsAnimatingLines] = useState(false);

  const [lineDrawingAnimationSpeed, setLineDrawingAnimationSpeed] =
    useState(0.1);

  const handleDrawStraight = () => {
    appRef.current?.drawLines('straight');
  };

  const handleDrawCurved = () => {
    appRef.current?.drawLines('curved');
  };

  const handleSelectAll = () => {
    appRef.current?.selectAllPoints();
  };

  const handleClearAll = () => {
    appRef.current?.clearAll();
  };

  const handleDrawRandomPoints = () => {
    appRef.current?.drawRandomPoints();
  };

  const handleLineDrawingAnimationSpeedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLineDrawingAnimationSpeed(parseFloat(e.target.value));
    appRef.current?.setLineDrawingAnimationSpeed(lineDrawingAnimationSpeed);
  };

  const handleIsAnimatingLinesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsAnimatingLines(e.target.checked);
    appRef.current?.setIsAnimatingLines(e.target.checked);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (!isInitializingRef.current) {
      const instance = new PointsAndLinesApp(containerRef.current);

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
      <div className="flex gap-2.5  mb-3">
        <button
          className="px-2.5 py-2 bg-blue-400 rounded-sm cursor-pointer"
          onClick={handleDrawStraight}
        >
          Draw straight
        </button>
        <button
          className="px-2.5 py-2 bg-blue-400 rounded-sm cursor-pointer"
          onClick={handleDrawCurved}
        >
          Draw curved
        </button>
        <button
          className="px-2.5 py-2 bg-blue-400 rounded-sm cursor-pointer"
          onClick={handleSelectAll}
        >
          Select all
        </button>
        <button
          className="px-2.5 py-2 bg-blue-400 rounded-sm cursor-pointer"
          onClick={handleClearAll}
        >
          Clear all
        </button>
        <button
          className="px-2.5 py-2 bg-blue-400 rounded-sm cursor-pointer"
          onClick={handleDrawRandomPoints}
        >
          Random points
        </button>
        <div className="flex items-center gap-1.5">
          <label htmlFor="bunny-4-rotation-speed">Animate lines:</label>
          <input
            id="bunny-4-rotation-speed"
            type="checkbox"
            checked={isAnimatingLines}
            onChange={handleIsAnimatingLinesChange}
          />
        </div>
        {isAnimatingLines && (
          <div className="flex flex-col">
            <label htmlFor="line-drawing-animation-speed">
              Animation speed:
            </label>
            <input
              id="line-drawing-animation-speed"
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={lineDrawingAnimationSpeed}
              onChange={handleLineDrawingAnimationSpeedChange}
            />
          </div>
        )}
      </div>
      <div className="h-200">
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="mt-2">
        <p>Click on the canvas to create points.</p>
        <p>
          Select points by clicking on them or clicking on Select all button.
        </p>
        <p>
          Use "Draw straight" or "Draw curved" to draw lines between points.
        </p>
        <p>Press CTRL and LMB to use selection rectangle.</p>
      </div>
    </>
  );
}
