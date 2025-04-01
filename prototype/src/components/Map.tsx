"use client";

import React, { useEffect, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  KeepScale,
} from "react-zoom-pan-pinch";
import "./Map.css";
import { Abel } from "next/font/google";

interface Pin {
  postCount: number;
  location: string;
  color: string;
  Text?: string;
}

const pins: Pin[] = [
  {
    postCount: 3,
    location: "14",
    color: "rgba(255, 0, 0, 0.5)",
    Text: "Searles",
  }, // 14 is Searles
  {
    postCount: 5,
    location: "70",
    color: "rgba(0, 0, 255, 0.5)",
    Text: "Throne",
  }, // 70 is Throne
  {
    postCount: 2,
    location: "38",
    color: "rgba(0, 255, 0, 0.5)",
    Text: "Smith Union",
  }, // 38 is Smith
  {
    postCount: 4,
    location: "58",
    color: "rgba(0,0,0,0.5)",
    Text: "Watson Arena",
  },
];

const Map: React.FC = () => {
  const [points, setPoints] = useState<{ [key: string]: [number, number] }>({});
  const [loading, setLoading] = useState(true);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    fetch("/points.json")
      .then((response) => response.json())
      .then((data) => {
        setPoints(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching points data:", error);
        setLoading(false);
      });
  }, []);

  const handleImageLoad = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
  };

  const renderPins = () => {
    if (imageDimensions.width === 0 || imageDimensions.height === 0)
      return null;

    return pins.map((pin, index) => {
      const point = points[pin.location];
      if (!point) return null;

      const topPercent = (point[1] / Number(imageDimensions.height)) * 100;
      const leftPercent = (point[0] / Number(imageDimensions.width)) * 100;

      return (
        <div
          key={index}
          style={{
            position: "absolute",
            top: `${topPercent}%`,
            left: `${leftPercent}%`,
            transform: `translate(-50%, -50%)`,
          }}
        >
          <KeepScale>
            {/* Within this KeepScale component, you can assume the top left
              corner of the div is where the actual building is (technically transform
              is supposed to make it centered but idk what was happening).
             What I feel like would be nice: when user is not actively interacting,
             the div is just a dot, but on hover the actual building name is displayed.  */}
            <div
              className="absolute text-white p-2 rounded w-auto"
              style={{
                backgroundColor: pin.color,
              }}
            >
              {`${pin.Text}: ${pin.postCount}`}
            </div>
          </KeepScale>
        </div>
      );
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex items-center justify-center w-full max-h-[70vh] overflow-hidden relative">
      <div className="max-w-4xl w-full min-h-80 px-4 border border-gray-300">
        <TransformWrapper>
          <TransformComponent>
            {/* <KeepScale> */}
            <div className="relative w-full h-auto">
              <img
                src={`/campus-map-main.png`}
                alt="Campus Map"
                onLoad={handleImageLoad}
              />
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
