import {
    Application,
    extend
} from '@pixi/react';
import {
    Container,
    Graphics,
    Sprite,
} from 'pixi.js';

import { GettingStartedStage } from '../components/GettingStartedStage';
import { useState } from 'react';

extend({
    Container,
    Graphics,
    Sprite,
});

export default function GettingStarted() {
    const [bunnyMoveSpeed, setBunnyMoveSpeed] = useState(1);
    const [bunnyRotationSpeed, setBunnyRotationSpeed] = useState(0.1);

    const handleBunnyMoveSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBunnyMoveSpeed(parseInt(e.target.value));
    }

    const handleBunnyRotationSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBunnyRotationSpeed(parseInt(e.target.value) / 10);
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Getting started</h1>
            <p className="text-slate-600">
                This is simple initial project
            </p>
            <div className='my-5'>
                <div className='flex'>
                    <div className='flex flex-col'>
                        <label htmlFor="bunny-speed">
                            Bunny speed
                        </label>
                        <input
                            id='bunny-speed'
                            type='range'
                            min={1}
                            max={10}
                            step={1}
                            value={bunnyMoveSpeed}
                            onChange={handleBunnyMoveSpeedChange} />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="bunny-speed">
                            Bunny rotation speed
                        </label>
                        <input
                            id='bunny-speed'
                            type='range'
                            min={1}
                            max={10}
                            step={1}
                            value={bunnyRotationSpeed * 10}
                            onChange={handleBunnyRotationSpeedChange} />
                    </div>
                </div>
                <Application>
                    <GettingStartedStage bunnyMoveSpeed={bunnyMoveSpeed} bunnyRotationSpeed={bunnyRotationSpeed} />
                </Application>
            </div>
        </div>
    );
}