"use client";

import React, { useState, useEffect } from "react";
import MenuBar from "./MenuBar";
import Map from "./Map";
import PostList from "./PostList";

export interface Post {
  id: number;
  location: string;
  content: string;
  score: number;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch posts once and keep state here.
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
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, [baseURL]);

  // Function to add or update a post.
  const addOrUpdatePost = (newData: Post | Post[]) => {
    if (Array.isArray(newData)) {
      setPosts(newData);
    } else {
      setPosts((prevPosts) => {
        const index = prevPosts.findIndex((p) => p.id === newData.id);
        if (index !== -1) {
          const updatedPosts = [...prevPosts];
          updatedPosts[index] = newData;
          return updatedPosts;
        } else {
          return [newData, ...prevPosts];
        }
      });
    }
  };

  // Handle modal closure with new post info.
  const handleModalClose = (newPost?: Post) => {
    if (newPost) {
      addOrUpdatePost(newPost);
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen">
    <MenuBar onModalClose={handleModalClose} />

    <main className="flex flex-col items-center justify-center w-full">
    <Map posts={posts} />
      <div className="w-full md:w-1/2 h-full overflow-y-auto">
        <PostList posts={posts} onPostUpdate={addOrUpdatePost} />
      </div>
    </main>
    </div>
  );

  /*return (
    <div className="flex flex-col items-center min-h-screen">
      <MenuBar onModalClose={handleModalClose} />
      <main className="flex flex-col items-center justify-center w-full">
        <Map posts={posts} />  {} //pass posts to map
        <PostList posts={posts} onPostUpdate={addOrUpdatePost} /> {}// Pass posts and update function 
      </main>
    </div>
  );*/
};

export default HomePage;
