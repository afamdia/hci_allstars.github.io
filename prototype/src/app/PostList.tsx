"use client";

import React, { useState, useEffect } from "react";
import { Post } from "./page";

interface VoteProps {
  postId: string;
  onUpdatePost: (post: Post) => void;
}

function Upvote({ postId, onUpdatePost }: VoteProps) {
  async function handleClick() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${postId}?action=upvote`, { method: "POST" });
      if (res.ok) {
        const updatedPost = await res.json();
        onUpdatePost(updatedPost);
      } else {
        console.error(`Failed to upvote id ${postId}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <button onClick={handleClick} className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-blue-500 hover:border-b-blue-700"></button>
  );
}

function Downvote({ postId, onUpdatePost }: VoteProps) {
  async function handleClick() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${postId}?action=downvote`, { method: "POST" });
      if (res.ok) {
        const updatedPost = await res.json();
        onUpdatePost(updatedPost);
      } else {
        console.error(`Failed to downvote id ${postId}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <button onClick={handleClick} className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-t-red-500 hover:border-t-red-700"></button>
  );
}

interface PostListProps {
  posts: Post[];
  onPostUpdate: (post: Post) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostUpdate }) => {
  const [locationMapping, setLocationMapping] = useState<Record<string, string>>({});

  // Fetch the mapping file from public folder.
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

  return (
    <section className="w-full max-w-3xl mx-auto overflow-y-auto p-6 bg-gray-100 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Posts</h2>
      {posts.length === 0 ? (
        <div className="text-gray-600 italic">No posts yet. Be the first to post!</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="flex items-start bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow transition">
            <div className="flex flex-col items-center mr-4">
              <Upvote postId={post.id.toString()} onUpdatePost={onPostUpdate} />
              <div>{post.score}</div>
              <Downvote postId={post.id.toString()} onUpdatePost={onPostUpdate} />
            </div>
            <div className="flex flex-col">
              {/* Use the mapping: if available, display human-readable location */}
              <div className="text-sm text-gray-500 mb-1">
                📍 {locationMapping[post.location] ?? post.location}
              </div>
              <div className="text-base text-gray-900">{post.content}</div>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default PostList;