import { Application, FederatedPointerEvent, Point, Rectangle } from 'pixi.js';

import type { IPixiApplication } from '@/features/pixiCanvas';
import { CurvedLineNode } from './CurvedLineNode';
import { PointNode } from './PointNode';
import { RectangleNode } from './RectangleNode';
import { StraightLineNode } from './StraightLineNode';
import { isInArea } from './utils';

export interface PointsAndLinesAppProps {
  selectAll?: () => void;
  drawStraightLines?: () => void;
  drawCurvedLines?: () => void;
  clearAll?: () => void;
  drawRandomPoints?: () => void;
}

export class PointsAndLinesApp implements IPixiApplication<PointsAndLinesAppProps> {
  public app: Application;
  private container: HTMLDivElement;

  private selectedPoints: Set<PointNode> = new Set();
  private isSelecting = false;
  private selectionStartPoint!: Point | null;
  private selectionArea!: RectangleNode | null;

  constructor(container: HTMLDivElement, updateProps?: PointsAndLinesAppProps) {
    this.app = new Application();
    this.container = container;
    if (updateProps) {
      updateProps.selectAll = this.selectAllPoints;
      updateProps.drawStraightLines = this.drawStraightLines;
      updateProps.drawCurvedLines = this.drawCurvedLines;
      updateProps.clearAll = this.clearAll;
      updateProps.drawRandomPoints = this.drawRandomPoints;
    }
  }

  async init() {
    await this.app.init({
      background: '#ecf0f1',
      width: 1200,
      height: 820,
      antialias: true,
    });

    this.container.appendChild(this.app.canvas);

    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = new Rectangle(
      0,
      0,
      this.app.screen.width,
      this.app.screen.height,
    );
    this.app.stage.on('pointerdown', this.stagePointerDown);
    this.app.stage.on('pointerup', this.stagePointerUp);
    this.app.stage.on('mousemove', this.stageMouseMove);
  }

  destroy() {
    this.app.destroy(true, { children: true });
  }

  private stagePointerDown = (e: FederatedPointerEvent) => {
    if (e.target !== this.app.stage) return;

    const { x, y } = e.getLocalPosition(e.currentTarget);

    if (this.isInRestrictedArea(x, y)) return;

    if (e.button === 1) {
      this.isSelecting = true;
      this.selectionStartPoint = new Point(x, y);

      this.selectionArea = new RectangleNode(x, y, 1, 1);

      this.app.stage.addChild(this.selectionArea);

      return;
    }

    const point = new PointNode(x, y);

    point.on('click', this.onPointClick);

    this.app.stage.addChild(point);
  };

  private stageMouseMove = (e: FederatedPointerEvent) => {
    if (!this.isSelecting || !this.selectionArea || !this.selectionStartPoint)
      return;

    const { x, y } = e.getLocalPosition(e.currentTarget);

    if (this.isInRestrictedArea(x, y)) {
      return;
    }

    const width = x - this.selectionStartPoint.x;
    const height = y - this.selectionStartPoint.y;

    this.selectionArea.x =
      width < 0 ? this.selectionStartPoint.x + width : this.selectionArea.x;
    this.selectionArea.y =
      height < 0 ? this.selectionStartPoint.y + height : this.selectionArea.y;
    this.selectionArea.rectWidth = Math.abs(width);
    this.selectionArea.rectHeight = Math.abs(height);
    this.selectionArea.draw();
  };

  private stagePointerUp = () => {
    if (!this.isSelecting || !this.selectionArea) return;

    const points = this.app.stage.children.filter(
      (c) => c.label === 'point-node',
    );
    const pointsInArea = points.filter((p) =>
      isInArea(this.selectionArea!, p.x, p.y),
    ) as PointNode[];

    pointsInArea.forEach((p) => {
      p.toggleSelection();
      this.selectedPoints.add(p);
    });

    this.app.stage.removeChild(this.selectionArea);
    this.isSelecting = false;
    this.selectionArea = null;
    this.selectionStartPoint = null;
  };

  private onPointClick = (e: FederatedPointerEvent) => {
    e.stopPropagation();

    const point = e.currentTarget as PointNode;

    point.toggleSelection();

    if (point.isSelected) {
      this.selectedPoints.add(point);
    } else {
      this.selectedPoints.delete(point);
    }
  };

  private deselectSelectedPoints = () => {
    this.selectedPoints.forEach((sp) => {
      sp.toggleSelection();
    });

    this.selectedPoints.clear();
  };

  private selectAllPoints = () => {
    const pointsToSelect = this.app.stage.getChildrenByLabel(
      'point-node',
    ) as PointNode[];

    if (pointsToSelect.length === 0) return;

    pointsToSelect.forEach((p) => {
      p.toggleSelection();
      this.selectedPoints.add(p);
    });
  };

  private drawStraightLines = () => {
    const selectedPoints = Array.from(this.selectedPoints);
    if (selectedPoints.length < 2) return;

    for (let i = 0; i < selectedPoints.length; i++) {
      if (!selectedPoints[i + 1]) break;

      const newLine = new StraightLineNode(
        new Point(selectedPoints[i].x, selectedPoints[i].y),
        new Point(selectedPoints[i + 1].x, selectedPoints[i + 1].y),
      );

      this.app.stage.addChild(newLine);
    }

    this.deselectSelectedPoints();
  };

  private drawCurvedLines = () => {
    const selectedPoints = Array.from(this.selectedPoints);

    if (selectedPoints.length < 2) return;

    for (let i = 0; i < selectedPoints.length; i += 2) {
      const startPoint = selectedPoints[i];
      let controlPoint = selectedPoints[i + 1];
      let endPoint = selectedPoints[i + 2];

      if (!controlPoint && !endPoint) break;

      if (!endPoint) {
        endPoint = controlPoint;

        const controlPointX =
          startPoint.x + (endPoint.x - startPoint.x) / 2 + 20;
        const controlPointY =
          startPoint.y + (endPoint.y - startPoint.y) / 2 + 20;

        controlPoint = new PointNode(controlPointX, controlPointY);
      }

      const cpX =
        2 * controlPoint.position.x -
        (startPoint.position.x + endPoint.position.x) / 2;
      const cpY =
        2 * controlPoint.position.y -
        (startPoint.position.y + endPoint.position.y) / 2;
      const newLine = new CurvedLineNode(
        new Point(startPoint.x, startPoint.y),
        new Point(cpX, cpY),
        new Point(endPoint.x, endPoint.y),
      );

      this.app.stage.addChild(newLine);
    }

    this.deselectSelectedPoints();
  };

  private clearAll = () => {
    const labelsToCheck = [
      'point-node',
      'straight-line-node',
      'curved-line-node',
    ];
    const nodesToRemove = this.app.stage.children.filter((c) =>
      labelsToCheck.includes(c.label),
    );

    nodesToRemove.forEach((n) => this.app.stage.removeChild(n));
    this.selectedPoints.clear();
  };

  private drawRandomPoints = () => {
    console.log('Drawing random points');
    const count = Math.floor(Math.random() * 10) + 1;

    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * this.app.screen.width);
      const y = Math.floor(Math.random() * this.app.screen.height);

      const point = new PointNode(x, y);
      this.app.stage.addChild(point);
    }
  };

  private isInRestrictedArea = (x: number, y: number) => {
    return isInArea(
      new RectangleNode(
        0,
        0,
        this.app.screen.width,
        this.app.screen.height * 0.07,
      ),
      x,
      y,
    );
  };
}
