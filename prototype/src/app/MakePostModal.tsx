"use client";
import React, { useState, useEffect } from "react";
import { Post } from "./page";

interface MakePostModalProps {
  onClose: (newPost?: Post) => void;
}

const MakePostModal: React.FC<MakePostModalProps> = ({ onClose }) => {
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [locationMapping, setLocationMapping] = useState<Record<string, string>>({});

  // Fetch location mapping for the dropdown.
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Build a list of valid option strings.
    const validOptions = Object.entries(locationMapping).map(
      ([key, value]) => `${key} - ${value}`
    );
    // Check that the input value exists in the valid options.
    if (!validOptions.includes(location)) {
      console.log("Invalid location selected");
      alert("Please select a valid location from the list.");
      return;
    }
    const extractedLocation = location.split(" - ")[0].trim();
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/post?content=" +
          encodeURIComponent(content) +
          "&location=" +
          encodeURIComponent(extractedLocation),
        { method: "POST" }
      );
      if (res.ok) {
        // Capture json from new post: {id, location, content, score:0}
        const newPost = await res.json();
        onClose(newPost);
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div 
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <div className="bg-white text-black p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4">Make Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1">Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border w-full p-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                e.target.setCustomValidity("");
              }}
              onBlur={(e) => {
                // Build a list of valid option strings.
                const validOptions = Object.entries(locationMapping).map(
                  ([key, value]) => `${key} - ${value}`
                );
                if (!validOptions.includes(e.target.value)) {
                  e.target.setCustomValidity("Please select a valid location from the list.");
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              className="border w-full p-2"
              list="locationOptions"
              required
            />
            <datalist id="locationOptions">
              {Object.entries(locationMapping).map(([key, value]) => (
                <option key={key} value={`${key} - ${value}`} />
              ))}
            </datalist>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => onClose()} className="px-3 py-1 rounded border">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakePostModal;
