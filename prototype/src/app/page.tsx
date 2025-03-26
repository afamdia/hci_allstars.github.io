// src/app/page.tsx

import React from "react";
import MenuBar from "../components/MenuBar";
import Map from "../components/Map";
import PostsList from "../components/PostList";

const HomePage: React.FC = () => {
  return (
    <div className="container">
      <MenuBar />
      <main>
        <Map />
        <PostsList />
      </main>
    </div>
  );
};

export default HomePage;
