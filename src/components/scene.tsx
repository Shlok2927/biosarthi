// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import useWindow from "./useWindow";

// export default function Scene() {
//   const { dimension } = useWindow();
//   const canvas = useRef<HTMLCanvasElement | null>(null);
//   const prevPosition = useRef<{ x: number; y: number } | null>(null);
//   const [uncoveredArea, setUncoveredArea] = useState(0);
//   const totalArea = dimension.width * dimension.height;
//   const uncoverThreshold = totalArea * 0.3;
//   const [maskStyle, setMaskStyle] = useState<string>("");

//   useEffect(() => {
//     if (dimension.width > 0) {
//       init();
//     }
//   }, [dimension]);

//   useEffect(() => {
//     const uncoveredPercentage = (uncoveredArea / totalArea) * 100;

//     // Update the mask style if the uncovered area exceeds the threshold
//     if (uncoveredArea >= uncoverThreshold) {
//       setMaskStyle(
//         `radial-gradient(circle at ${dimension.width / 2}px ${
//           dimension.height / 2
//         }px, transparent 0%, transparent ${uncoveredPercentage}%, black ${uncoveredPercentage}%)`
//       );
//     }
//   }, [uncoveredArea]);

//   const init = () => {
//     if (canvas.current) {
//       const ctx = canvas.current.getContext("2d");
//       if (ctx) {
//         ctx.fillStyle = "black";
//         ctx.fillRect(0, 0, dimension.width, dimension.height);
//         ctx.globalCompositeOperation = "destination-out";
//       }
//     }
//   };

//   const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

//   const manageMouseMove = (
//     e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
//   ) => {
//     const { clientX, clientY, movementX, movementY } = e;
//     const nbOfCircles = Math.max(Math.abs(movementX), Math.abs(movementY)) / 10;

//     if (prevPosition.current != null) {
//       const { x, y } = prevPosition.current;
//       for (let i = 0; i < nbOfCircles; i++) {
//         const targetX = lerp(x, clientX, (1 / nbOfCircles) * i);
//         const targetY = lerp(y, clientY, (1 / nbOfCircles) * i);
//         draw(targetX, targetY, 50);
//       }
//     }

//     prevPosition.current = {
//       x: clientX,
//       y: clientY,
//     };
//   };

//   const draw = (x: number, y: number, radius: number) => {
//     if (canvas.current) {
//       const ctx = canvas.current.getContext("2d");
//       if (ctx) {
//         ctx.beginPath();
//         ctx.arc(x, y, radius, 0, 2 * Math.PI);
//         ctx.fill();

//         // Calculate the area of the drawn circle and add it to the uncovered area
//         const circleArea = Math.PI * radius * radius;
//         setUncoveredArea((prev) => prev + circleArea);
//       }
//     }
//   };

//   return (
//     <div className="relative w-full h-full overflow-hidden">
//       <div
//         className="absolute w-full h-full transition-all duration-500 ease-in-out"
//         style={{
//           background: maskStyle,
//           maskImage: `radial-gradient(circle at ${dimension.width / 2}px ${
//             dimension.height / 2
//           }px, transparent 0%, black ${(uncoveredArea / totalArea) * 100}%)`,
//           WebkitMaskImage: `radial-gradient(circle at ${
//             dimension.width / 2
//           }px ${dimension.height / 2}px, transparent 0%, black ${
//             (uncoveredArea / totalArea) * 100
//           }%)`,
//         }}
//       />
//       <canvas
//         ref={canvas}
//         onMouseMove={manageMouseMove}
//         height={dimension.height}
//         width={dimension.width}
//         style={{ position: "absolute", top: 0, left: 0 }}
//       />
//     </div>
//   );
// }

"use client";
import React, { useEffect, useRef, useState } from "react";
import useWindow from "./useWindow";

export default function Scene() {
  const { dimension } = useWindow();
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const prevPosition = useRef<{ x: number; y: number } | null>(null);
  const [uncoveredArea, setUncoveredArea] = useState(0);
  const totalArea = dimension.width * dimension.height;
  const uncoverThreshold = totalArea * 0.3;
  const [maskStyle, setMaskStyle] = useState<string>("");
  const [isClicking, setIsClicking] = useState(false);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (dimension.width > 0) {
      init();
    }
  }, [dimension]);

  useEffect(() => {
    const uncoveredPercentage = (uncoveredArea / totalArea) * 100;

    if (uncoveredArea >= uncoverThreshold) {
      setMaskStyle(
        `radial-gradient(circle at ${dimension.width / 2}px ${
          dimension.height / 2
        }px, transparent 0%, transparent ${uncoveredPercentage}%, black ${uncoveredPercentage}%)`
      );
    }
  }, [uncoveredArea]);

  useEffect(() => {
    if (isClicking && clickPosition) {
      // Start revealing the page from the last click position
      const x = clickPosition.x;
      const y = clickPosition.y;

      // Mask style to reveal the whole page smoothly
      setMaskStyle(
        `radial-gradient(circle at ${x}px ${y}px, transparent 0%, black 100%)`
      );
    }
  }, [isClicking, clickPosition]);

  const init = () => {
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, dimension.width, dimension.height);
        ctx.globalCompositeOperation = "destination-out";
      }
    }
  };

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const manageMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const { clientX, clientY, movementX, movementY } = e;
    const nbOfCircles = Math.max(Math.abs(movementX), Math.abs(movementY)) / 10;

    if (prevPosition.current != null) {
      const { x, y } = prevPosition.current;
      for (let i = 0; i < nbOfCircles; i++) {
        const targetX = lerp(x, clientX, (1 / nbOfCircles) * i);
        const targetY = lerp(y, clientY, (1 / nbOfCircles) * i);
        draw(targetX, targetY, 50);
      }
    }

    prevPosition.current = {
      x: clientX,
      y: clientY,
    };
  };

  const manageMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const { clientX, clientY } = e;
    setIsClicking(true);
    setClickPosition({ x: clientX, y: clientY });
  };

  const manageMouseUp = () => {
    setIsClicking(false);
  };

  const draw = (x: number, y: number, radius: number) => {
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();

        // Calculate the area of the drawn circle and add it to the uncovered area
        const circleArea = Math.PI * radius * radius;
        setUncoveredArea((prev) => prev + circleArea);
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute w-full h-full transition-all duration-500 ease-in-out"
        style={{
          background: maskStyle,
          maskImage: `radial-gradient(circle at ${dimension.width / 2}px ${
            dimension.height / 2
          }px, transparent 0%, black ${(uncoveredArea / totalArea) * 100}%)`,
          WebkitMaskImage: `radial-gradient(circle at ${
            dimension.width / 2
          }px ${dimension.height / 2}px, transparent 0%, black ${
            (uncoveredArea / totalArea) * 100
          }%)`,
        }}
      />
      <canvas
        ref={canvas}
        onMouseMove={manageMouseMove}
        onMouseDown={manageMouseDown}
        onMouseUp={manageMouseUp}
        height={dimension.height}
        width={dimension.width}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
}
