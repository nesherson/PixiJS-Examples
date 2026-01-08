import { PixiCanvas } from '@/features/pixiCanvas';
import { GettingStartedApp } from './pixi/GettingStartedApp';

export function GettingStarted() {
  return (
    <>
      <p className="text-slate-600 mb-3">This is simple initial project</p>
      <div className="h-200">
        <PixiCanvas applicationClass={GettingStartedApp} />
      </div>
      <div className="mt-2">
        <p>Use sliders to control the speed of the animation.</p>
        <p>Bunny 5 can be dragged and dropped.</p>
      </div>
    </>
  );
}
