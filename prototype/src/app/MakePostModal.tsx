"use client";
import React, { useState } from "react";

// Extend onClose to optionally receive the new post
interface MakePostModalProps {
  onClose: (newPost?: any) => void;
}

const MakePostModal: React.FC<MakePostModalProps> = ({ onClose }) => {
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/post?content=" +
          encodeURIComponent(content) +
          "&location=" +
          encodeURIComponent(location),
        { method: "POST" }
      );
      if (res.ok) {
        // Capture json from new post: {id, location, content, score:0}
        const newPost = await res.json();
        // Instead of updating here, pass the newPost via onClose.
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
    // Screw tailwind I am doing this manually.
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-80">
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
              onChange={(e) => setLocation(e.target.value)}
              className="border w-full p-2"
              required
            />
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