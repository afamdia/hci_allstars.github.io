// src/components/Map.tsx

"use client";

import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./Map.css";

const Map: React.FC = () => {
  return (
    <section className="flex items-center justify-center w-full max-h-[70vh] overflow-hidden relative">
      <div className="max-w-4xl w-full px-4 border border-gray-300">
        <TransformWrapper>
          <TransformComponent>
            <div className="relative flex items-center justify-center w-full">
              <img
                src={`/campus-map-main.png`}
                alt="Campus Map"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </section>
  );
};

export default Map;
