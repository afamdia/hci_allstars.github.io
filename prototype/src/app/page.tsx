// src/app/page.tsx

import React from "react";
import MenuBar from "../components/MenuBar";
import Map from "../components/Map";
import PostsList from "../components/PostList";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <MenuBar />
      <main className="flex flex-col items-center justify-center w-full">
        <Map />
        <PostsList />
      </main>
    </div>
  );
};

export default HomePage;
