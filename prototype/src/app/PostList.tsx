"use client";

import React, { useState, useEffect } from "react";
import { Post } from "./page";

interface VoteProps {
  postId: string;
  onUpdatePost: (post: Post) => void;
  voteType: 'up' | 'down' | null;
  onVote: (newVote: 'up' | 'down' | null) => void;
}

function Upvote({ postId, onUpdatePost, voteType, onVote }: VoteProps) {
  async function handleClick() {
    // Action is like this: if current status is 'up' we wanna cancel 
    // the upvote by downvoting, if null, we upvote, if down, we upvote twice
    // to cancel the downvote and upvote
    const action = voteType === 'up' ? 'downvote' : 'upvote';
    const needToCancelDownvote = voteType === 'down';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${postId}?action=${action}`, {
        method: "POST",
      });
      if (res.ok) {
        const updatedPost = await res.json();
        onUpdatePost(updatedPost);
        onVote(voteType === 'up' ? null : 'up');
      } else {
        console.error(`Failed to ${action} post ${postId}`);
      }
      if (needToCancelDownvote) {
        const cancelRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${postId}?action=upvote`, {
          method: "POST",
        });
        if (cancelRes.ok) {
          const updatedPost = await cancelRes.json();
          onUpdatePost(updatedPost);
          onVote('up');
        } else {
          console.error(`Failed to cancel downvote for post ${postId}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`
        bg-transparent p-0 m-0
        w-0 h-0
        border-l-4 border-l-transparent
        border-r-4 border-r-transparent
        border-b-8
        ${voteType === 'up' ? 'border-b-blue-700 scale-200' : 'border-b-blue-500 scale-150'} 
        transform transition-transform duration-200 
        hover:border-b-blue-700 hover:scale-175
      `}
    />
  );
}

function Downvote({ postId, onUpdatePost, voteType, onVote }: VoteProps) {
  async function handleClick() {
    // Action is like this: if current status is 'down' we wanna cancel
    // the downvote by upvoting, if null, we downvote, if up, we downvote twice
    // to cancel the upvote and downvote
    const action = voteType === 'down' ? 'upvote' : 'downvote';
    const needToCancelUpvote = voteType === 'up';
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${postId}?action=${action}`, {
        method: "POST",
      });
      if (res.ok) {
        const updatedPost = await res.json();
        onUpdatePost(updatedPost);
        onVote(voteType === 'down' ? null : 'down');
      } else {
        console.error(`Failed to ${action} post ${postId}`);
      }
      if (needToCancelUpvote) {
        const cancelRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${postId}?action=downvote`, {
          method: "POST",
        });
        if (cancelRes.ok) {
          const updatedPost = await cancelRes.json();
          onUpdatePost(updatedPost);
          onVote('down');
        } else {
          console.error(`Failed to cancel upvote for post ${postId}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`
        bg-transparent p-0 m-0
        w-0 h-0
        border-l-4 border-l-transparent
        border-r-4 border-r-transparent
        border-t-8
        ${voteType === 'down' ? 'border-t-red-700 scale-200' : 'border-t-red-500 scale-150'} 
        transform transition-transform duration-200 
        hover:border-t-red-700 hover:scale-175
      `}
    />
  );
}

interface PostListProps {
  posts: Post[];
  onPostUpdate: (post: Post) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostUpdate }) => {
  const [locationMapping, setLocationMapping] = useState<Record<string, string>>({});
  const [voteStatus, setVoteStatus] = useState<Record<string, 'up' | 'down' | null>>({});

  useEffect(() => {
    const basePath = process.env.NODE_ENV === "production" ? "/hci_allstars.github.io" : "";
    fetch(`${basePath}/location-mapping.json`)
      .then((res) => res.json())
      .then((data) => setLocationMapping(data))
      .catch((error) => console.error("Error fetching location mapping:", error));
  }, []);

  const handleVote = (postId: number, newVote: 'up' | 'down' | null) => {
    setVoteStatus((prev) => ({ ...prev, [postId]: newVote }));
  };

  return (
    <section className="w-full max-w-3xl mx-auto overflow-y-auto p-6 bg-gray-100 rounded-xl shadow-md">
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
              <Upvote
                postId={post.id.toString()}
                onUpdatePost={onPostUpdate}
                voteType={voteStatus[post.id] ?? null}
                onVote={(newVote) => handleVote(post.id, newVote)}
              />
              <div>{post.score}</div>
              <Downvote
                postId={post.id.toString()}
                onUpdatePost={onPostUpdate}
                voteType={voteStatus[post.id] ?? null}
                onVote={(newVote) => handleVote(post.id, newVote)}
              />
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-gray-500 mb-1">
                📍 {locationMapping[post.location] ?? post.location}
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