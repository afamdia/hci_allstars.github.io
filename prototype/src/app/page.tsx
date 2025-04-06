// src/app/page.tsx

import React from "react";
import MenuBar from "./MenuBar";
import Map from "./Map";
import PostsList from "./PostList";

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
