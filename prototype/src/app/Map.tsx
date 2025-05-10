"use client";

import React, { useEffect, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  KeepScale,
} from "react-zoom-pan-pinch";
import "./Map.css";
import { Post } from "./page";

const prefix = process.env.NODE_ENV === 'production'
  ? '/hci_allstars.github.io'
  : ''

interface MapProps {
  posts: Post[];
}

const bowdoinColors: [number, number, number][] = [
  [0, 80, 106], // Atlantic
  [115, 0, 81], // Lupine
  [149, 80, 33], // Bark
  [115, 40, 34], //Brick
  [29, 92, 87], //Spruce
  [104, 124, 47], // Pine
];

// Simple hash function to convert string to integer
const getHashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const Map: React.FC<MapProps> = ({ posts }) => {
  const [points, setPoints] = useState<{ [key: string]: [number, number] }>({});
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [locationMapping, setLocationMapping] = useState<
    Record<string, string>
  >({});

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

  // Fetch location mapping.
  useEffect(() => {
    fetch("/location-mapping.json")
      .then((res) => res.json())
      .then((data) => {
        setLocationMapping(data);
      })
      .catch((error) => {
        console.error("Error fetching location mapping:", error);
      });
  }, []);

  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    setImageDimensions({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
    });
  };

  // Compute pins by aggregating posts by location.
  const computedPins = (() => {
    const pinMap: Record<string, number> = {};
    posts.forEach((post) => {
      pinMap[post.location] = (pinMap[post.location] || 0) + 1;
    });
    return Object.entries(pinMap).map(([location, count]) => {
      const randomColor = `rgba(
        ${bowdoinColors[getHashCode(location) % bowdoinColors.length][0]},
        ${bowdoinColors[getHashCode(location) % bowdoinColors.length][1]},
        ${bowdoinColors[getHashCode(location) % bowdoinColors.length][2]},
        0.7)`;
      return {
        location,
        color: randomColor,
        Text: locationMapping[location] ?? location,
        postCount: count,
      };
    });
  })();

  const renderPins = () => {
    if (imageDimensions.width === 0 || imageDimensions.height === 0)
      return null;
    return computedPins.map((pin, index) => {
      const point = points[pin.location];
      if (!point) return null;
      const topPercent = (point[1] / imageDimensions.height) * 100;
      const leftPercent = (point[0] / imageDimensions.width) * 100;

      return (
        <div
          key={index}
          style={{
            position: "absolute",
            top: `${topPercent}%`,
            left: `${leftPercent}%`,
            // transform: `translate(-50%, -50%)`,
          }}
        >
          <KeepScale>
            {/* Within this KeepScale component, you can assume the top left
              corner of the div is where the actual building is (technically transform
              is supposed to make it centered but idk what was happening).
             What I feel like would be nice: when user is not actively interacting,
             the div is just a dot, but on hover the actual building name is displayed.  */}
            <div
              className="absolute text-white p-2 rounded w-auto whitespace-nowrap"
              style={{
                backgroundColor: pin.color,
              }}
            >
              {pin.Text}: <strong>{pin.postCount}</strong>
            </div>
          </KeepScale>
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
              <img
                src={`${prefix}/campus-map-main.png`}
                alt="Campus Map"
                onLoad={handleImageLoad}
              />
              {renderPins()}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </section>
  );
};

export default Map;
