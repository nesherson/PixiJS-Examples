import { useEffect, useRef, type RefObject } from "react";
import type { IPixiApp } from "../types/app";

export function useApp<TApp extends IPixiApp>(
  containerRef: RefObject<HTMLDivElement | null>,
  AppClass: new () => TApp,
  onAppReady?: (app: TApp) => void,
) {
  const appRef = useRef<TApp | null>(null);
  const isInializingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;
    if (appRef.current) return;

    const app = new AppClass();

    appRef.current = app;

    const initApp = async () => {
      try {
        isInializingRef.current = true;

        await app.init();

        container?.appendChild(app.canvas);
        if (onAppReady) onAppReady(app);
      } catch (err) {
        console.error("Pixi initialization failed", err);
      } finally {
        isInializingRef.current = false;
      }
    };

    initApp();

    return () => {
      if (appRef.current && !isInializingRef.current) {
        if (container.contains(appRef.current.canvas)) {
          container.removeChild(appRef.current.canvas);
        }

        appRef.current.destroy();
        appRef.current = null;
      }
    };
  }, [containerRef, AppClass, onAppReady]);
}
