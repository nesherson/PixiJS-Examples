import {
    useTick
} from '@pixi/react';

import { useState } from 'react';
import { BunnySprite } from '../components/BunnySprite';

interface GettingStartedStageProps {
    bunnyMoveSpeed: number;
    bunnyRotationSpeed: number;
}

export function GettingStartedStage({ bunnyMoveSpeed, bunnyRotationSpeed }: GettingStartedStageProps) {
    const [isActive, setIsActive] = useState(false);
    const [xPos, setXPos] = useState(150);
    const [direction, setDirection] = useState(1);
    const [rotation, setRotation] = useState(0);

    useTick((ticker) => {
        let tempXPos = xPos;
        let tempDirection = direction;

        const delta = ticker.deltaTime;

        if (tempXPos >= 600) {
            tempDirection = -1;
        }
        else if (tempXPos <= 150) {
            tempDirection = 1;
        }

        tempXPos = tempXPos + tempDirection * delta * bunnyMoveSpeed;

        setRotation(prev => prev + bunnyRotationSpeed);
        setDirection(tempDirection);
        setXPos(tempXPos);
    });

    return (
        <pixiContainer>
            <BunnySprite
                x={100}
                y={100}
                onClick={() => setIsActive(prev => !prev)}
                scale={isActive ? 1.75 : 1} />
            <BunnySprite
                x={xPos}
                y={100} />
            <BunnySprite
                x={100}
                y={150}
                rotation={rotation} />
        </pixiContainer>
    );
}