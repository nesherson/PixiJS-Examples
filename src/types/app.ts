export interface IPixiApp {
  canvas: HTMLCanvasElement;
  init(): Promise<void> | void;
  destroy(): void;
}
