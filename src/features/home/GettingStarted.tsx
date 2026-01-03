import { PixiCanvas } from '@/features/pixiCanvas';
import { GettingStartedApp } from './pixi/GettingStartedApp';

export function GettingStarted() {
  return (
    <>
      <p className="text-slate-600 mb-3">This is simple initial project</p>
      <PixiCanvas applicationClass={GettingStartedApp} />
    </>
  );
}
