// src/components/PostList.tsx

"use client";

import React, { useState, useEffect } from "react";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Upvoting and Downvoting
function Upvote({ postId }: { postId: string }) {
  const [value, setValue] = useState(0);

  async function handleClick() {
    try {
      const res = await fetch(`${baseURL}/post/${postId}?action=upvote`, { method: "POST" });

      if (res.ok) {
        setValue(value + 1);
      } else {
        console.error(`Failed to upvote id ${postId}`);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <div className="flex flex-col items-center mr-4">
      <button
        className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-blue-500 hover:border-b-blue-700"
        onClick={handleClick}
      ></button>
    </div>
    //<button className="upvote-button" onClick={handleClick}> {value} </button>
  );
}

function Downvote({ postId }: { postId: string }) {
  const [value, setValue] = useState(0);

  async function handleClick() {
    try {
      const res = await fetch(`${baseURL}/post/${postId}?action=downvote`, { method: "POST" });

      if (res.ok) {
        setValue(value + 1);
      } else {
        console.error(`Failed to downvote id ${postId}`);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <div className="flex flex-col items-center mr-4">
      <button
        className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-t-red-500 hover:border-t-red-700"
        onClick={handleClick}
      ></button>
    </div>
  );
}

// Scrolling through posts
interface Post {
  id: number;
  location: string;
  content: string;
  score: number;
}

const placeholderPosts: Post[] = [
  { id: 1, location: "14", content: "The steps by Moulton are very icy.", score: 69},
  { id: 2, location: "14", content: "Bowdoin Wi-Fi went down in HL.", score: 69},
  { id: 3, location: "14", content: "A tree fell on Coleman", score: 69},
  { id: 4, location: "14", content: "The list is too slow", score: 69},
];

const PostList: React.FC = () => {
  // eslint-disable-next-line
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${baseURL}/post`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <section className="w-full max-w-3xl mx-auto max-h-[500px] overflow-y-auto p-6 bg-gray-100 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Posts</h2>
      {posts.length === 0 ? (
        <div className="text-gray-600 italic">
          No posts yet. Be the first to post!
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="flex items-start bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow transition"
          >
            <div className="flex flex-col items-center mr-4">
              <Upvote postId={post.id.toString()}/>
              <div className="flex flex-col items-center mr-4">{post.score}</div>
              <Downvote postId={post.id.toString()}/>
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-gray-500 mb-1">
                👤 Bowdoin Student
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
