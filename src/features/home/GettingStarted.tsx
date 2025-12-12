import { useState, type ChangeEvent } from "react";
import { PixiCanvas } from "@/features/pixiCanvas";
import {
  GettingStartedApp,
  type GettingStartedAppUpdateProps,
} from "./pixi/GettingStartedApp";

export function GettingStarted() {
  const [bunnyTwoMoveSpeed, setBunnyTwoMoveSpeed] = useState(1);
  const [bunnyThreeRotationSpeed, setBunnyThreeRotationSpeed] = useState(0.05);
  const [bunnyFourRotationSpeed, setBunnyFourRotationSpeed] = useState(0.01);

  const updateProps: GettingStartedAppUpdateProps = {
    bunnyTwoMoveSpeed,
    bunnyThreeRotationSpeed,
    bunnyFourRotationSpeed,
  };

  const handleBunnyTwoMoveSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBunnyTwoMoveSpeed(parseInt(e.target.value));
  };

  const handleBunnyThreeRotationSpeedChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setBunnyThreeRotationSpeed(parseInt(e.target.value) / 100);
  };

  const handleBunnyFourRotationSpeedChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setBunnyFourRotationSpeed(parseInt(e.target.value) / 100);
  };

  return (
    <>
      <p className="text-slate-600">This is simple initial project</p>
      <div className="flex my-3">
        <div className="flex flex-col mr-5">
          <label htmlFor="bunny-1-move-speed">Bunny 2 speed</label>
          <input
            id="bunny-1-move-speed"
            type="range"
            min={1}
            max={10}
            step={1}
            value={bunnyTwoMoveSpeed}
            onChange={handleBunnyTwoMoveSpeedChange}
          />
        </div>
        <div className="flex flex-col mr-5">
          <label htmlFor="bunny-3-rotation-speed">Bunny 3 rotation speed</label>
          <input
            id="bunny-3-rotation-speed"
            type="range"
            min={1}
            max={10}
            step={1}
            value={bunnyThreeRotationSpeed * 100}
            onChange={handleBunnyThreeRotationSpeedChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="bunny-4-rotation-speed">Bunny 4 rotation speed</label>
          <input
            id="bunny-4-rotation-speed"
            type="range"
            min={1}
            max={10}
            step={1}
            value={bunnyFourRotationSpeed * 100}
            onChange={handleBunnyFourRotationSpeedChange}
          />
        </div>
      </div>
      <PixiCanvas
        applicationClass={GettingStartedApp}
        updateProps={updateProps}
      />
    </>
  );
}
