import {
  Application,
  Container,
  FederatedPointerEvent,
  Point,
  Rectangle,
  Text,
  TextStyle,
} from 'pixi.js';

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
  private selectionStartPoint: Point | null = null;
  private selectionArea: RectangleNode | null = null;
  private clickTimer: number | null = null;

  constructor(container: HTMLDivElement, updateProps?: PointsAndLinesAppProps) {
    this.app = new Application();
    this.container = container;
    if (updateProps) {
      updateProps.selectAll = this.selectAllPoints;
      updateProps.drawStraightLines = () => this.drawLines('straight');
      updateProps.drawCurvedLines = () => this.drawLines('curved');
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
    if (e.button === 1) return;

    const { x, y } = e.getLocalPosition(e.currentTarget);

    if (this.clickTimer) {
      this.isSelecting = true;
      this.selectionStartPoint = new Point(x, y);
      this.selectionArea = new RectangleNode(x, y, 1, 1);

      this.app.stage.addChild(this.selectionArea);
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
    } else {
      this.clickTimer = setTimeout(() => {
        const points = this.app.stage.children.filter(
          (c) => c.label === 'point-container-node',
        );
        const point = new PointNode();
        const text = new Text({
          text: `${points.length + 1}`,
          x: -10,
          y: -15,
          style: new TextStyle({ fontSize: 10 }),
        });
        const container = new Container();

        container.label = 'point-container-node';
        container.x = x;
        container.y = y;

        container.addChild(point);
        container.addChild(text);

        point.on('click', this.onPointClick);

        // this.app.stage.addChild(point);
        this.app.stage.addChild(container);
        this.clickTimer = null;
      }, 300);
    }
  };

  private stageMouseMove = (e: FederatedPointerEvent) => {
    if (!this.isSelecting || !this.selectionArea || !this.selectionStartPoint)
      return;

    const { x, y } = e.getLocalPosition(e.currentTarget);
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
      (c) => c.label === 'point-container-node',
    );
    const pointsInArea = (
      points.filter((p) =>
        isInArea(this.selectionArea!, p.x, p.y),
      ) as PointNode[]
    ).filter((p) => p.canBeSelected);

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

    if (!point.canBeSelected) return;

    point.toggleSelection();

    if (point.isSelected) {
      this.selectedPoints.add(point);
    } else {
      this.selectedPoints.delete(point);
    }
  };

  private deselectSelectedPoints = (disableSelection = false) => {
    const selectedPoints = Array.from(this.selectedPoints);

    if (selectedPoints.length <= 1) return;

    selectedPoints.forEach((sp) => {
      sp.toggleSelection();

      if (disableSelection) sp.disableSelection();
    });

    this.selectedPoints.clear();
  };

  private selectAllPoints = () => {
    const pointsToSelect = (
      this.app.stage.getChildrenByLabel('point-container-node') as Container[]
    )
      .flatMap((container) => container.children as PointNode[])
      .filter((p) => p.canBeSelected);

    if (pointsToSelect.length === 0) return;

    pointsToSelect.forEach((p) => {
      if (!p.isSelected) {
        p.toggleSelection();
        this.selectedPoints.add(p);
      }
    });
  };

  private drawStraightLines = () => {
    const selectedPoints = Array.from(this.selectedPoints);
    if (selectedPoints.length < 2) return;

    for (let i = 0; i < selectedPoints.length; i++) {
      if (!selectedPoints[i + 1]) break;

      const startPoint = selectedPoints[i];
      const endPoint = selectedPoints[i + 1];

      const newLine = new StraightLineNode(startPoint, endPoint);

      this.app.stage.addChild(newLine);
    }
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

        if (i >= 2) {
          const prevStart = selectedPoints[i - 2];
          const prevPassThrough = selectedPoints[i - 1];
          const currentStart = startPoint;
          const prevCpX =
            2 * prevPassThrough.x - (prevStart.x + currentStart.x) / 2;
          const prevCpY =
            2 * prevPassThrough.y - (prevStart.y + currentStart.y) / 2;
          const tangentX = currentStart.x - prevCpX;
          const tangentY = currentStart.y - prevCpY;
          const prevLen = Math.sqrt(tangentX * tangentX + tangentY * tangentY);
          const currLen = Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) +
              Math.pow(endPoint.y - startPoint.y, 2),
          );
          const scale = prevLen > 0 ? (currLen / prevLen) * 0.5 : 0;
          const desiredCpX = startPoint.x + tangentX * scale;
          const desiredCpY = startPoint.y + tangentY * scale;
          const midX = (startPoint.x + endPoint.x) / 2;
          const midY = (startPoint.y + endPoint.y) / 2;

          controlPoint = new PointNode(
            (desiredCpX + midX) / 2,
            (desiredCpY + midY) / 2,
          );
        } else {
          controlPoint = new PointNode(
            (startPoint.x + endPoint.x) / 2,
            (startPoint.y + endPoint.y) / 2,
          );
        }
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
  };

  private clearAll = () => {
    const labelsToCheck = [
      'point-container-node',
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
    const count = Math.floor(Math.random() * 10) + 1;

    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * this.app.screen.width);
      const y = Math.floor(Math.random() * this.app.screen.height);

      const point = new PointNode(x, y);
      this.app.stage.addChild(point);
    }
  };

  private drawLines = (lineType: string) => {
    if (lineType === 'straight') {
      this.drawStraightLines();
    } else if (lineType === 'curved') {
      this.drawCurvedLines();
    }

    this.deselectSelectedPoints(true);
  };
}
