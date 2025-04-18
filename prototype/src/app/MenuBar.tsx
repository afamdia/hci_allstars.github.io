// src/components/MenuBar.tsx

"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from 'next/link'


const MenuBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full bg-gray-800 text-white p-4">
      <div className="flex items-center justify-between">
        {/* User Profile Button */}
        <button className="flex flex-col items-center gap-1">
          <Image
            src={"/user-img.png"}
            alt="User profile"
            width={32}
            height={32}
            className="rounded-full"
            />
            <span className="text-sm font-medium">Profile</span>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li><Link href="/make-post" className="hover:underline">Make Post</Link></li>
          <li><Link href="/help" className="hover:underline">Help</Link></li>
        </ul>

        {/* Mobile Button (no external icons) */}
        <button 
          onClick={toggleMenu} 
          className="md:hidden text-2xl focus:outline-none"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="flex flex-col gap-3 mt-4 md:hidden">
          <li><Link href="/" className="block hover:underline">Home</Link></li>
          <li><Link href="/make-post" className="block hover:underline">Make Post</Link></li>
          <li><Link href="/help" className="block hover:underline">Help</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default MenuBar;
