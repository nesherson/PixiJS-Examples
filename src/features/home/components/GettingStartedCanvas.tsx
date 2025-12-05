import { useRef, useState } from "react";
import { GettingStartedApp } from "../pixi/GettingStartedApp";
import { useApp } from "../../../hooks/useApp";

export function GettingStartedCanvas() {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const [app, setApp] = useState<GettingStartedApp | null>(null);
  useApp(pixiContainerRef, GettingStartedApp, (app) => {
    setApp(app);
  });

  const [bunnyTwoMoveSpeed, setBunnyTwoMoveSpeed] = useState(1);
  const [bunnyThreeRotationSpeed, setBunnyThreeRotationSpeed] = useState(0.05);
  const [bunnyFourRotationSpeed, setBunnyFourRotationSpeed] = useState(0.01);

  const handleBunnyOneMoveSpeedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const moveSpeed = parseInt(e.target.value);

    setBunnyTwoMoveSpeed(moveSpeed);
    app?.setBunnyTwoMoveSpeed(moveSpeed);
  };

  const handleBunnyThreeRotationSpeedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rotationSpeed = parseInt(e.target.value) / 100;

    setBunnyThreeRotationSpeed(parseInt(e.target.value) / 100);
    app?.setBunnyThreeRotationSpeed(rotationSpeed);
  };

  const handleBunnyFourRotationSpeedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rotationSpeed = parseInt(e.target.value) / 100;

    setBunnyFourRotationSpeed(parseInt(e.target.value) / 100);
    app?.setBunnyFourRotationSpeed(rotationSpeed);
  };

  return (
    <div className="p-6">
      <div className="rounded-lg">
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
              onChange={handleBunnyOneMoveSpeedChange}
            />
          </div>
          <div className="flex flex-col mr-5">
            <label htmlFor="bunny-3-rotation-speed">
              Bunny 3 rotation speed
            </label>
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
            <label htmlFor="bunny-4-rotation-speed">
              Bunny 4 rotation speed
            </label>
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
        <div
          ref={pixiContainerRef}
          style={{ width: "800px", height: "600px" }}
        />
      </div>
    </div>
  );
}
