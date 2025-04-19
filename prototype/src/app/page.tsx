"use client";

import React, { useRef } from "react";
import MenuBar from "./MenuBar";
import Map from "./Map";
import PostList, { PostListHandle } from "./PostList";

const HomePage: React.FC = () => {
  const postListRef = useRef<PostListHandle>(null);

  // Define onClose here so that when MakePostModal returns a new post,
  // you can update PostList by calling addOrUpdatePost
  const handleModalClose = (newPost?: any) => {
    if (newPost && postListRef.current) {
      postListRef.current.addOrUpdatePost(newPost);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <MenuBar onModalClose={handleModalClose} />
      <main className="flex flex-col items-center justify-center w-full">
        <Map />
        <PostList ref={postListRef} />
      </main>
    </div>
  );
};

export default HomePage;