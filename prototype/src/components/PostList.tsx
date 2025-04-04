// src/components/PostList.tsx

"use client";

import React, { useState } from "react";
import './PostList.css';


// Upvoting and Downvoting
function Upvote() {
  const [value, setValue] = useState(0);

  function handleClick() {
    setValue(value+1);
  }

  return (
    <div className="triangle-wrapper">
      <button className="upvote-button" onClick={handleClick}></button>
      <span className="value"> {value} </span>
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
    <div className="triangle-wrapper">
      <button className="downvote-button" onClick={handleClick}></button>
      <span className="value"> {value} </span>
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
];

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  return (
    <section className="post-list w-full max-w-4xl mx-auto max-h-[400px] overflow-y-scroll p-4 border rounded-md bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Posts</h2>
      {posts.length === 0 ? (
        <div className="text-gray-500 italic">No posts yet. Be the first to post!</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="flex items-start mb-4 border p-3 rounded-md bg-gray-50">
            {/* Placeholder for future voting UI */}
            <div className="vote-layout">
              <Upvote />
              <Downvote />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">👤 Bowdoin Student</div>
              <div>{post.content}</div>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default PostList;
