import type { Container, ContainerChild } from 'pixi.js';

export function getStage(container: Container<ContainerChild>) {
  let current = container.parent;

  while (current?.parent) {
    current = current.parent;
  }

  return current;
}
