import {
    useTick
} from '@pixi/react';

import { useState } from 'react';
import { BunnySprite } from '../components/BunnySprite';

interface GettingStartedStageProps {
    canvasWidth: number;
    canvasHeight: number;
    bunnyTwoMoveSpeed: number;
    bunnyThreeRotationSpeed: number;
    bunnyFourRotationSpeed: number;
}

export function GettingStartedStage({
    canvasWidth,
    canvasHeight,
    bunnyTwoMoveSpeed,
    bunnyThreeRotationSpeed,
    bunnyFourRotationSpeed }: GettingStartedStageProps) {
    const [angle, setAngle] = useState(0);
    const [bunnyOne, setBunnyOne] = useState({
        name: 'Bunny 1',
        isActive: false,
        x: canvasWidth * 0.2,
        y: canvasHeight * 0.2
    });
    const [bunnyTwo, setBunnyTwo] = useState({
        name: 'Bunny 2',
        isActive: false,
        x: canvasWidth * 0.8,
        y: canvasHeight * 0.2,
        direction: 1
    });
    const [bunnyThree, setBunnyThree] = useState({
        name: 'Bunny 3',
        isActive: false,
        x: canvasWidth * 0.2,
        y: canvasHeight * 0.8,
        rotation: 0
    });
    const [bunnyFour, setBunnyFour] = useState({
        name: 'Bunny 4',
        isActive: false,
        radius: 50,
        x: canvasWidth * 0.8 + Math.cos(angle) * 50,
        y: canvasHeight * 0.8 + Math.sin(angle) * 50
    });

    useTick((ticker) => {
        const delta = ticker.deltaTime;

        let tempBunnyTwoXPos = bunnyTwo.x;
        let tempDirection = bunnyTwo.direction;
        const tempAngle = angle + bunnyFourRotationSpeed * delta;

        if (tempBunnyTwoXPos >= canvasWidth * 0.9) {
            tempDirection = -1;
        }
        else if (tempBunnyTwoXPos <= canvasWidth * 0.7) {
            tempDirection = 1;
        }

        tempBunnyTwoXPos = tempBunnyTwoXPos + tempDirection * delta * bunnyTwoMoveSpeed;

        setBunnyTwo(prev => ({
            ...prev,
            x: tempBunnyTwoXPos,
            direction: tempDirection
        }));
        setBunnyThree(prev => ({
            ...prev,
            rotation: prev.rotation + bunnyThreeRotationSpeed
        }));
        setBunnyFour(prev => ({
            ...prev,
            x: canvasWidth * 0.8 + Math.cos(tempAngle) * prev.radius,
            y: canvasHeight * 0.8 + Math.sin(tempAngle) * prev.radius
        }));
        setAngle(tempAngle);
    });

    const handleBunnyOneClick = () => {
        setBunnyOne(prev => ({
            ...prev,
            isActive: !prev.isActive
        }));
    }

    return (
        <pixiContainer>
            <BunnySprite
                name={bunnyOne.name}
                x={bunnyOne.x}
                y={bunnyOne.y}
                onClick={handleBunnyOneClick}
                scale={bunnyOne.isActive ? 1.75 : undefined} />
            <BunnySprite
                name={bunnyTwo.name}
                x={bunnyTwo.x}
                y={bunnyTwo.y} />
            <BunnySprite
                name={bunnyThree.name}
                x={bunnyThree.x}
                y={bunnyThree.y}
                rotation={bunnyThree.rotation} />
            <BunnySprite
                name={bunnyFour.name}
                x={bunnyFour.x}
                y={bunnyFour.y} />
        </pixiContainer>
    );
}