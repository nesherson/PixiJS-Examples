import { PixiCanvas } from '@/features/pixiCanvas';
import {
  PointsAndLinesApp,
  type PointsAndLinesAppProps,
} from './pixi/PointsAndLinesApp';
import { useMemo } from 'react';

export function PointsAndLines() {
  const updateProps = useMemo<PointsAndLinesAppProps>(
    () => ({
      selectAll: undefined,
      drawStraightLines: undefined,
      drawCurvedLines: undefined,
      clearAll: undefined,
    }),
    [],
  );

  const handleSelectAll = () => {
    if (updateProps.selectAll) {
      updateProps.selectAll();
    }
  };

  const handleDrawStraightLines = () => {
    if (updateProps.drawStraightLines) {
      updateProps.drawStraightLines();
    }
  };

  const handleDrawCurvedLines = () => {
    if (updateProps.drawCurvedLines) {
      updateProps.drawCurvedLines();
    }
  };

  const handleDrawRandomPoints = () => {
    if (updateProps.drawRandomPoints) {
      updateProps.drawRandomPoints();
    }
  };

  const handleClearAll = () => {
    if (updateProps.clearAll) {
      updateProps.clearAll();
    }
  };

  return (
    <>
      <div className="flex gap-1 mb-5">
        <button
          className="px-2.5 py-2 bg-blue-400 rounded-sm"
          onClick={handleDrawStraightLines}
        >
          Draw straight
        </button>
        <button
          className="px-2.5 py-2 bg-blue-400 rounded-sm"
          onClick={handleDrawCurvedLines}
        >
          Draw curved
        </button>
        <button
          className="px-2.5 py-2 bg-blue-400 rounded-sm"
          onClick={handleDrawRandomPoints}
        >
          Random points
        </button>
        <button
          className="px-2.5 py-2 bg-blue-400 rounded-sm"
          onClick={handleSelectAll}
        >
          Select all
        </button>
        <button
          className="px-2.5 py-2 bg-blue-400 rounded-sm"
          onClick={handleClearAll}
        >
          Clear all
        </button>
      </div>
      <PixiCanvas
        applicationClass={PointsAndLinesApp}
        updateProps={updateProps}
      />
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
