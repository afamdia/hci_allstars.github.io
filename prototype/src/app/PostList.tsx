"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface Post {
  id: number;
  location: string;
  content: string;
  score: number;
}

export interface PostListHandle {
  addOrUpdatePost: (newData: Post | Post[]) => void;
}

interface VoteProps {
  postId: string;
  onUpdatePost: (post: Post) => void;
}

function Upvote({ postId, onUpdatePost }: VoteProps) {
  async function handleClick() {
    try {
      const res = await fetch(`${baseURL}/post/${postId}?action=upvote`, { method: "POST" });
      if (res.ok) {
        // The endpoint returns the updated post JSON.
        const updatedPost = await res.json();
        // Call the parent's update function.
        onUpdatePost(updatedPost);
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
  );
}

function Downvote({ postId, onUpdatePost }: VoteProps) {
  async function handleClick() {
    try {
      const res = await fetch(`${baseURL}/post/${postId}?action=downvote`, { method: "POST" });
      if (res.ok) {
        // The endpoint returns the updated post JSON.
        const updatedPost = await res.json();
        // Call the parent's update function.
        onUpdatePost(updatedPost);
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

const PostList = forwardRef<PostListHandle>((_, ref) => {
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

  // Exposed function to add or update post(s).
  const addOrUpdatePost = (newData: Post | Post[]) => {
    if (Array.isArray(newData)) {
      // Replace the entire list.
      setPosts(newData);
    } else {
      // Check if the post exists; update if it does, or add it otherwise.
      setPosts((prevPosts) => {
        const index = prevPosts.findIndex((p) => p.id === newData.id);
        if (index !== -1) {
          // Update the existing post.
          const updatedPosts = [...prevPosts];
          updatedPosts[index] = newData;
          return updatedPosts;
        } else {
          // Add the new post at the beginning.
          return [newData, ...prevPosts];
        }
      });
    }
  };

  useImperativeHandle(ref, () => ({
    addOrUpdatePost,
  }));

  return (
    <section className="w-full max-w-3xl mx-auto max-h-[500px] overflow-y-auto p-6 bg-gray-100 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Posts</h2>
      {posts.length === 0 ? (
        <div className="text-gray-600 italic">No posts yet. Be the first to post!</div>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="flex items-start bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow transition"
          >
            <div className="flex flex-col items-center mr-4">
              {/* Pass addOrUpdatePost as onUpdatePost so that the vote buttons update the list */}
              <Upvote postId={post.id.toString()} onUpdatePost={addOrUpdatePost} />
              <div className="flex flex-col items-center mr-4">{post.score}</div>
              <Downvote postId={post.id.toString()} onUpdatePost={addOrUpdatePost} />
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
});

PostList.displayName = "PostList";
export default PostList;