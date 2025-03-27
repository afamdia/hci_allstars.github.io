// src/components/Map.tsx

"use client";

import React from "react";
// import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./Map.css";

interface Pin {
  postCount: number;
  x: number;
  y: number;
  color: string;
}

const pins: Pin[] = [
  { postCount: 3, x: 10, y: 30, color: "rgba(255, 0, 0, 0.5)" }, // Red with 50% transparency
  { postCount: 5, x: 30, y: 20, color: "rgba(0, 0, 255, 0.5)" }, // Blue with 50% transparency
  { postCount: 2, x: 50, y: 50, color: "rgba(0, 255, 0, 0.5)" }, // Green with 50% transparency
];

const Map: React.FC = () => {
  // const [zoomLevel, setZoomLevel] = useState(1);

  // const handleZoom = (ref: ReactZoomPanPinchRef) => {
  //   console.log("Zoom level:", ref.state.scale);
  //   console.log(ref);
  //   setZoomLevel(ref.state.scale);
  // };

  const renderPins = () => {
    return pins.map((pin, index) => (
      <div
        key={index}
        className="absolute text-white p-2 rounded"
        style={{
          top: `${pin.x}%`,
          left: `${pin.y}%`,
          backgroundColor: pin.color,
          transform: `translate(-50%, -50%)`,
          // transformOrigin: "top left",
        }}
      >
        {`Posts: ${pin.postCount}`}
      </div>
    ));
  };

  return (
    <section className="flex items-center justify-center w-full max-h-[70vh] overflow-hidden relative">
      <div className="max-w-4xl w-full min-h-80 px-4 border border-gray-300">
        <TransformWrapper>
          <TransformComponent>
            {/* <KeepScale> */}
            <div className="relative w-full h-auto">
              <img src={`/campus-map-main.png`} alt="Campus Map" />
              {/* IDE will tell you to use Image from NextJS, don't. react-zoom-pan-pinch does not work with it. */}
              {renderPins()}
            </div>
            {/* </KeepScale> */}
          </TransformComponent>
        </TransformWrapper>
      </div>
    </section>
  );
};

export default Map;
