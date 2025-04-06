// src/components/PostList.tsx

"use client";

import React, { useState } from "react";


// Upvoting and Downvoting
function Upvote() {
  const [value, setValue] = useState(0);

  function handleClick() {
    setValue(value+1);
  }

  return (
    <div className="flex flex-col items-center mr-4">
      <button className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-blue-500 hover:border-b-blue-700" onClick={handleClick}></button>
      <span className="text-sm text-gray-600 mt-1"> {value} </span>
    </div>
    //<button className="upvote-button" onClick={handleClick}> {value} </button>
  );
}


function Downvote() {
  const [value, setValue] = useState(0);

  function handleClick() {
    setValue(value+1);
  }

  return (
    <div className="flex flex-col items-center mr-4">
      <span className="text-sm text-gray-600 mt-1"> {value} </span>
      <button className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-t-red-500 hover:border-t-red-700" onClick={handleClick}></button>
    </div>
  );
}



// Scrolling through posts
interface Post {
  id: number
  content: string
  //upvotes: number
  //downvotes: number // Decide later if downvotes are even necessary
}

const initialPosts: Post[] = [
  { id: 1, content: "The steps by Moulton are very icy."},
  { id: 2, content: "Bowdoin Wi-Fi went down in HL."},
  { id: 3, content: "A tree fell on Coleman"},
  { id: 4, content: "The list is too slow"},
];

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  return (
    <section className="w-full max-w-3xl mx-auto max-h-[500px] overflow-y-auto p-6 bg-gray-100 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Posts</h2>
      {posts.length === 0 ? (
        <div className="text-gray-600 italic">No posts yet. Be the first to post!</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="flex items-start bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow transition">
            {/* Placeholder for future voting UI */}
            <div className="flex flex-col items-center mr-4">
              <Upvote />
              <Downvote />
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-gray-500 mb-1">👤 Bowdoin Student</div>
              <div className="text-base text-gray-900">{post.content}</div>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default PostList;
