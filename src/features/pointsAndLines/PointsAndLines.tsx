import { PixiCanvas } from '@/features/pixiCanvas';
import { PointsAndLinesApp } from './pixi/PointsAndLinesApp';

export function PointsAndLines() {
  return (
    <>
      <PixiCanvas applicationClass={PointsAndLinesApp} />
      <div className="mt-2">
        <p>Click on the canvas to create points.</p>
        <p>
          Select points by clicking on them or clicking on Select all button.
        </p>
        <p>
          Use "Draw straight" or "Draw curved" to draw lines between points.
        </p>
        <p>Hold MMB to use selection rectangle.</p>
      </div>
    </>
  );
}
