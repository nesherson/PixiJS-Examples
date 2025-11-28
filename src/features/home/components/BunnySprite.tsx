import {
    Assets,
    TextStyle,
    Texture,
    type ColorSource,
} from 'pixi.js';
import {
    useEffect,
    useState,
} from 'react';

interface BunnySpriteProps {
    onClick?: () => void;
    scale?: number;
    x: number;
    y: number;
    rotation?: number;
    name?: string;
    tint?: ColorSource;
}

export function BunnySprite({ onClick, scale = 1.25, x, y, rotation = 0, name, tint }: BunnySpriteProps) {
    const [texture, setTexture] = useState(Texture.EMPTY);

    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets
                .load('https://pixijs.com/assets/bunny.png')
                .then((result) => {
                    setTexture(result)
                });
        }
    }, [texture]);

    return (
        <pixiContainer>
            {name &&
                <pixiText
                    anchor={0.5}
                    text={name}
                    style={new TextStyle({
                        fill: '#ffffff',
                        fontSize: 12
                    })}
                    x={x}
                    y={y - 30 * scale} />}
            <pixiSprite
                anchor={0.5}
                eventMode={'static'}
                onClick={onClick}
                scale={scale}
                texture={texture}
                x={x}
                y={y}
                rotation={rotation}
                tint={tint} />
        </pixiContainer>
    );
}
