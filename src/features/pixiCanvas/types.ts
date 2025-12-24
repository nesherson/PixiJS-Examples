export interface IPixiApplication {
  init(): Promise<void>;
  destroy(): void;
}

export type PixiApplicationConstructor = new (
  container: HTMLDivElement,
) => IPixiApplication;
