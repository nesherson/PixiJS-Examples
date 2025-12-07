import { useEffect, useRef } from "react";
import type { IPixiApplication, PixiApplicationConstructor } from "./types";

interface BaseProps {
  className?: string;
}

type PixiCanvasProps<T> = BaseProps & {
  applicationClass: PixiApplicationConstructor<T>;
} & (T extends undefined ? { updateProps?: never } : { updateProps: T });

export const PixiCanvas = <T,>({ applicationClass: Application, updateProps, className }: PixiCanvasProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<IPixiApplication<T> | null>(null);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!isInitializingRef.current) {
      const instance = new Application(containerRef.current) as IPixiApplication<T>;
      appRef.current = instance;

      const init = async () => {
        try {
          isInitializingRef.current = true;
          await instance.init();
        } catch (e) {
          console.error("Pixi initialization failed", e);
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

  useEffect(() => {
    if (appRef.current && appRef.current.update && updateProps) {
      appRef.current.update(updateProps);
    }
  }, [updateProps]);

  return <div ref={containerRef} className={className} style={{ width: "100%", height: "100%" }} />;
};
