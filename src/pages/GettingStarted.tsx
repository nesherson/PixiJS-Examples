import {
    Application,
    extend,
} from '@pixi/react';
import {
    Container,
    Graphics,
    Sprite,
} from 'pixi.js';

import { BunnySprite } from '../components/BunnySprite'

extend({
    Container,
    Graphics,
    Sprite,
});

export default function GettingStarted() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Getting started</h1>
            <p className="text-slate-600">
                Welcome to the dashboard. This is the main landing area.
            </p>
            <Application>
                <BunnySprite />
            </Application>
        </div>
    );
}