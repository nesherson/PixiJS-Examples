import { useEffect, useRef } from "react";
import { PointsAndLinesApp } from "./pixi/PointsAndLinesApp";

export function PointsAndLinesCanvas() {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PointsAndLinesApp>(null);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    const initApp = async () => {
      if (isInitializingRef.current) return;

      const pointsAndLinesApp = new PointsAndLinesApp();

      appRef.current = pointsAndLinesApp;

      try {
        isInitializingRef.current = true;

        await pointsAndLinesApp.init();

        if (pixiContainerRef.current) {
          pixiContainerRef.current.appendChild(pointsAndLinesApp.app.canvas);
        }
      } finally {
        isInitializingRef.current = false;
      }
    };

    initApp();
  }, []);

  return (
    <>
      <div ref={pixiContainerRef} />
      <div className="mt-2">
        <p>Click on the canvas to create points.</p>
        <p>Select points by clicking on them or clicking on Select all button.</p>
        <p>Use "Draw straight" or "Draw curve" to draw lines between points.</p>
        <p>Hold MMB to use selection rectangle.</p>
      </div>
    </>
  );
}
