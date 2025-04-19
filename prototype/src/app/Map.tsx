"use client";

import React, { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./Map.css";
import { Post } from "./page";

interface Pin {
  location: string;
  color: string;
  Text?: string;
  postCount: number;
}

// Static configuration for pins.
const placeholderPins: Pin[] = [
  { location: "14", color: "rgba(255, 0, 0, 0.5)", Text: "Searles", postCount: 0 },
  { location: "70", color: "rgba(0, 0, 255, 0.5)", Text: "Throne", postCount: 0 },
  { location: "38", color: "rgba(0, 255, 0, 0.5)", Text: "Smith Union", postCount: 0 },
  { location: "58", color: "rgba(0, 0, 0, 0.5)", Text: "Watson Arena", postCount: 0 },
];

interface MapProps {
  posts: Post[];
}

const Map: React.FC<MapProps> = ({ posts }) => {
  const [points, setPoints] = useState<{ [key: string]: [number, number] }>({});
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Fetch coordinate points.
  useEffect(() => {
    fetch("/points.json")
      .then((response) => response.json())
      .then((data) => {
        setPoints(data);
        setLoadingPoints(false);
      })
      .catch((error) => {
        console.error("Error fetching points data:", error);
        setLoadingPoints(false);
      });
  }, []);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageDimensions({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
    });
  };

  // Compute pins using posts from props.
  const computedPins = placeholderPins.map((pin) => {
    const count = posts.filter((post) => post.location === pin.location).length;
    return { ...pin, postCount: count };
  });

  const renderPins = () => {
    if (imageDimensions.width === 0 || imageDimensions.height === 0) return null;
    return computedPins.map((pin, index) => {
      const point = points[pin.location];
      if (!point) return null;
      const topPercent = (point[1] / imageDimensions.height) * 100;
      const leftPercent = (point[0] / imageDimensions.width) * 100;
      return (
        <div
          key={index}
          className="absolute text-white p-2 rounded"
          style={{
            top: `${topPercent}%`,
            left: `${leftPercent}%`,
            backgroundColor: pin.color,
            transform: "translate(-50%, -50%)",
          }}
        >
          {`${pin.Text}: ${pin.postCount}`}
        </div>
      );
    });
  };

  if (loadingPoints) return <div>Loading...</div>;

  return (
    <section className="flex items-center justify-center w-full max-h-[70vh] overflow-hidden relative">
      <div className="max-w-4xl w-full min-h-80 px-4 border border-gray-300">
        <TransformWrapper>
          <TransformComponent>
            <div className="relative w-full h-auto">
              <img src="/campus-map-main.png" alt="Campus Map" onLoad={handleImageLoad} />
              {renderPins()}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </section>
  );
};

export default Map;