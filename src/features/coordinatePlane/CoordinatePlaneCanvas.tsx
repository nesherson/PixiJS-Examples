// import { Application, useExtend } from "@pixi/react";
// import { Container, Graphics, Rectangle as PixiRectangle, Sprite, Text } from "pixi.js";
// import { useRef } from "react";
// import { BunnySprite } from "../home/components/BunnySprite";
// import { StageWrapper } from "./StageWrapper";

// export function CoordinatePlaneCanvas() {
//     useExtend({ Container, Graphics, Sprite, Text });

//     const canvasWidth = 1020;
//     const canvasHeight = 1020;

//     const worldRef = useRef<Container>(null);

//     const handleWheel = (e: WheelEvent) => {
//         const world = worldRef.current;

//         if (!world)
//             return;

//         e.preventDefault();

//         const scaleFactor = 1.05;
//         const direction = e.deltaY > 0 ? 1 / scaleFactor : scaleFactor;
//         const oldScale = world.scale.x;
//         const newScale = oldScale * direction;

//         if (newScale < 0.1 || newScale > 10)
//             return;

//         const mouseGlobalX = e.offsetX;
//         console.log("🚀 ~ handleWheel ~ e.clientX:", e)
//         const mouseGlobalY = e.offsetY;
//         console.log("🚀 ~ handleWheel ~ e.clientY:", e.clientY)
//         const mouseLocalX = (mouseGlobalX - world.x) / oldScale;
//         const mouseLocalY = (mouseGlobalY - world.y) / oldScale;

//         world.scale.set(newScale);

//         world.x = mouseGlobalX - mouseLocalX * newScale;
//         world.y = mouseGlobalY - mouseLocalY * newScale;
//     }

//     return (
//         <div>
//             <Application
//                 width={canvasWidth}
//                 height={canvasHeight}
//                 background='#ecf0f1'
//                 antialias>
//                 <StageWrapper
//                     worldRef={worldRef}
//                     canvasWidth={canvasWidth}
//                     canvasHeight={canvasHeight}
//                     onWheel={handleWheel}
//                 >
//                     <pixiContainer
//                         ref={worldRef}
//                         eventMode='static'
//                         hitArea={new PixiRectangle(0, 0, canvasWidth, canvasHeight)}
//                     >
//                         <pixiGraphics draw={(g) => {
//                             g.clear()
//                                 .setFillStyle({ color: 0xFF0000 })
//                                 .circle(0, 0, 3)
//                                 .fill();
//                         }} />

//                         <BunnySprite
//                             x={200}
//                             y={200}
//                             scale={2}
//                         />
//                         <BunnySprite
//                             x={-200}
//                             y={-200}
//                             tint={0x00FF00}
//                         />
//                     </pixiContainer>
//                 </StageWrapper>
//             </Application>
//         </div>
//     );
// }
//
// import { useEffect, useRef } from "react";
import { useEffect, useRef } from "react";

import { CoordinatePlaneApp } from "./pixi/CoordinatePlaneApp";

export function CoordinatePlaneCanvas() {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<CoordinatePlaneApp>(null);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    const initApp = async () => {
      if (isInitializingRef.current) return;

      const application = new CoordinatePlaneApp();

      appRef.current = application;

      try {
        isInitializingRef.current = true;

        await application.init();

        if (pixiContainerRef.current) {
          pixiContainerRef.current.appendChild(application.app.canvas);
        }
      } finally {
        isInitializingRef.current = false;
      }
    };

    initApp();
  }, []);

  return (
    <>
      <div ref={pixiContainerRef} />
    </>
  );
}
