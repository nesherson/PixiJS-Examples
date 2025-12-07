export interface IPixiApplication<T = undefined> {
  init(): Promise<void>;
  destroy(): void;
  update?(updateProps: T): void;
}

export type PixiApplicationConstructor<T = undefined> = new (
  container: HTMLDivElement,
  updateProps?: T,
) => IPixiApplication;
