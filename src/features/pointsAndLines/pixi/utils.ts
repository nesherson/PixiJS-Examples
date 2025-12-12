import type { RectangleNode } from './RectangleNode';

export function isInArea(area: RectangleNode, x: number, y: number) {
  if (
    x >= area.x &&
    x <= area.x + area.width &&
    y >= area.y &&
    y <= area.y + area.height
  ) {
    return true;
  }
  return false;
}
