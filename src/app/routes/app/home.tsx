import {
    Application,
    useExtend
} from '@pixi/react';
import {
    Container,
    Graphics,
    Sprite,
    Text
} from 'pixi.js';

import { GettingStartedStage } from '../../../features/getting-started/components/GettingStartedStage';
import { useState } from 'react';

export default function Home() {
    useExtend({
        Container,
        Graphics,
        Sprite,
        Text
    });
    const canvasWidth = 800;
    const canvasHeight = 600;

    const [bunnyTwoMoveSpeed, setBunnyTwoMoveSpeed] = useState(1);
    const [bunnyThreeRotationSpeed, setBunnyThreeRotationSpeed] = useState(0.01);
    const [bunnyFourRotationSpeed, setBunnyFourRotationSpeed] = useState(0.01);

    const handleBunnyOneMoveSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBunnyTwoMoveSpeed(parseInt(e.target.value));
    }

    const handleBunnyThreeRotationSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBunnyThreeRotationSpeed(parseInt(e.target.value) / 100);
    }

    const handleBunnyFourRotationSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBunnyFourRotationSpeed(parseInt(e.target.value) / 100);
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Getting started</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <p className="text-slate-600">
                    This is simple initial project
                </p>
                <div className='flex my-5'>
                    <div className='flex flex-col mr-5'>
                        <label htmlFor="bunny-1-move-speed">
                            Bunny 2 speed
                        </label>
                        <input
                            id='bunny-1-move-speed'
                            type='range'
                            min={1}
                            max={10}
                            step={1}
                            value={bunnyTwoMoveSpeed}
                            onChange={handleBunnyOneMoveSpeedChange} />
                    </div>
                    <div className='flex flex-col mr-5'>
                        <label htmlFor="bunny-3-rotation-speed">
                            Bunny 3 rotation speed
                        </label>
                        <input
                            id='bunny-3-rotation-speed'
                            type='range'
                            min={1}
                            max={10}
                            step={1}
                            value={bunnyThreeRotationSpeed * 100}
                            onChange={handleBunnyThreeRotationSpeedChange} />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="bunny-4-rotation-speed">
                            Bunny 4 rotation speed
                        </label>
                        <input
                            id='bunny-4-rotation-speed'
                            type='range'
                            min={1}
                            max={10}
                            step={1}
                            value={bunnyFourRotationSpeed * 100}
                            onChange={handleBunnyFourRotationSpeedChange} />
                    </div>
                </div>
                <Application width={canvasWidth} height={canvasHeight}>
                    <GettingStartedStage
                        canvasWidth={canvasWidth}
                        canvasHeight={canvasHeight}
                        bunnyTwoMoveSpeed={bunnyTwoMoveSpeed}
                        bunnyThreeRotationSpeed={bunnyThreeRotationSpeed}
                        bunnyFourRotationSpeed={bunnyFourRotationSpeed} />
                </Application>
            </div>

        </div>
    );
}