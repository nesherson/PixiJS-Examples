import { Application, FederatedPointerEvent, Point, Rectangle } from 'pixi.js';

import type { IPixiApplication } from '@/features/pixiCanvas';
import { CurvedLineNode } from './CurvedLineNode';
import { PointNode } from './PointNode';
import { RectangleNode } from './RectangleNode';
import { SimpleToolbarNode } from './SimpleToolbarNode';
import { StraightLineNode } from './StraightLineNode';
import { isInArea } from './utils';

export class PointsAndLinesApp implements IPixiApplication {
  private BUTTONS_CONTAINER_HEIGHT = 80;

  private app: Application;
  private container: HTMLDivElement;
  private selectedPoints: Set<PointNode> = new Set();
  private isSelecting = false;
  private selectionStartPoint: Point | null = null;
  private selectionArea: RectangleNode | null = null;
  private showOrder?: boolean = undefined;
  private isAnimatingLines = false;

  constructor(container: HTMLDivElement) {
    this.app = new Application();
    this.container = container;
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

    this.addToolbar();

    this.app.stage.on('pointerdown', this.stagePointerDown);
    this.app.stage.on('pointerup', this.stagePointerUp);
    this.app.stage.on('mousemove', this.stageMouseMove);
  }

  destroy() {
    this.app.destroy(true, { children: true });
  }

  private addToolbar() {
    const buttonsContainer = new SimpleToolbarNode({
      x: this.app.screen.width * 0.02,
      y: this.app.screen.height * 0.02,
    })
      .addButton('Draw straight', async () => await this.drawLines('straight'))
      .addButton('Draw curved', async () => await this.drawLines('curved'))
      .addButton('Select all', this.selectAllPoints)
      .addButton('Clear all', this.clearAll)
      .addButton('Draw random points', this.drawRandomPoints)
      .addCheckbox('Show order', this.onShowOrderChanged)
      .addCheckbox('Animate lines', this.onAnimateLinesChanged);

    this.app.stage.addChild(buttonsContainer);
  }

  private stagePointerDown = (e: FederatedPointerEvent) => {
    if (e.target !== this.app.stage) return;
    if (e.button === 1) return;

    const { x, y } = e.getLocalPosition(e.currentTarget);

    if (this.isInsideButtonsContainer(y)) return;

    if (e.ctrlKey) {
      this.isSelecting = true;
      this.selectionStartPoint = new Point(x, y);
      this.selectionArea = new RectangleNode(x, y, 1, 1);

      this.app.stage.addChild(this.selectionArea);
    } else {
      const points = this.app.stage.children.filter(
        (c) => c.label === 'point-node',
      );

      const pointNode = new PointNode(x, y, points.length + 1, this.showOrder);

      pointNode.point.on('click', this.onPointClick);

      this.app.stage.addChild(pointNode);
    }
  };

  private stageMouseMove = (e: FederatedPointerEvent) => {
    if (!this.isSelecting || !this.selectionArea || !this.selectionStartPoint)
      return;

    const { x, y } = e.getLocalPosition(e.currentTarget);

    if (this.isInsideButtonsContainer(y)) return;

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
    const pointsInArea = (
      points.filter((p) =>
        isInArea(this.selectionArea!, p.x, p.y),
      ) as PointNode[]
    ).filter((p) => p.canBeSelected && !p.isSelected);

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

    const point = e.currentTarget.parent as PointNode;

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
      this.app.stage.getChildrenByLabel('point-node') as PointNode[]
    ).filter((p) => p.canBeSelected);

    if (pointsToSelect.length === 0) return;

    pointsToSelect.forEach((p) => {
      if (!p.isSelected) {
        p.toggleSelection();
        this.selectedPoints.add(p);
      }
    });
  };

  private drawStraightLines = async () => {
    const selectedPoints = Array.from(this.selectedPoints).sort(
      (a, b) => a.order - b.order,
    );

    if (selectedPoints.length < 2) return;

    for (let i = 0; i < selectedPoints.length; i++) {
      if (!selectedPoints[i + 1]) break;

      const startPoint = selectedPoints[i];
      const endPoint = selectedPoints[i + 1];

      const newLine = new StraightLineNode(startPoint, endPoint);

      this.app.stage.addChild(newLine);

      if (this.isAnimatingLines) {
        await newLine.animateLine();
      } else {
        newLine.draw();
      }
    }
  };

  private drawCurvedLines = async () => {
    const selectedPoints = Array.from(this.selectedPoints).sort(
      (a, b) => a.order - b.order,
    );

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

      if (this.isAnimatingLines) {
        await newLine.animateLine();
      } else {
        newLine.draw();
      }
    }
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
    const count = Math.floor(Math.random() * 10) + 1;
    const padding = 15;
    const innerWidth = this.app.screen.width - padding * 2;
    const innerHeight = this.app.screen.height - padding * 2;
    let nextIndex =
      this.app.stage.children.filter((c) => c.label === 'point-node').length +
      1;

    for (let i = 0; i < count; i++) {
      const x = Math.random() * innerWidth + padding;
      let y = Math.random() * innerHeight + padding;

      while (this.isInsideButtonsContainer(y)) {
        y = Math.random() * innerHeight + padding;
      }

      const point = new PointNode(x, y, nextIndex, this.showOrder);
      this.app.stage.addChild(point);

      nextIndex++;
    }
  };

  private drawLines = async (lineType: string) => {
    if (lineType === 'straight') {
      await this.drawStraightLines();
    } else if (lineType === 'curved') {
      await this.drawCurvedLines();
    }

    this.deselectSelectedPoints(true);
  };

  private onShowOrderChanged = (checked: boolean) => {
    this.app.stage.children
      .filter((c) => c.label === 'point-node')
      .forEach((point) => {
        const pointNode = point as PointNode;

        this.showOrder = checked;
        pointNode.showOrder = checked;

        pointNode.draw();
      });
  };

  private onAnimateLinesChanged = (checked: boolean) => {
    this.isAnimatingLines = checked;
  };

  private isInsideButtonsContainer = (y: number) => {
    return y < this.BUTTONS_CONTAINER_HEIGHT;
  };
}
