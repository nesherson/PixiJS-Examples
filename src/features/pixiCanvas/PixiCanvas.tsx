import { useEffect, useRef } from 'react';
import type { IPixiApplication, PixiApplicationConstructor } from './types';

interface PixiCanvasProps {
  className?: string;
  applicationClass: PixiApplicationConstructor;
}

export function PixiCanvas({
  applicationClass: Application,
  className,
}: PixiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<IPixiApplication | null>(null);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!isInitializingRef.current) {
      const instance = new Application(
        containerRef.current,
      ) as IPixiApplication;
      appRef.current = instance;

      const init = async () => {
        try {
          isInitializingRef.current = true;
          await instance.init();
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
  }, [Application]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
