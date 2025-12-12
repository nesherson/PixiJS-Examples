import { PixiCanvas } from "@/features/pixiCanvas";
import { CoordinatePlaneApp } from "./pixi/CoordinatePlaneApp";

export function CoordinatePlane() {
  return <PixiCanvas applicationClass={CoordinatePlaneApp} />;
}
