"use client";

import React from "react";

export default function BirdGamePage() {
  return (
    <div className="w-full h-screen p-0 m-0">
      <iframe
        src="/games/bird.html"
        title="Flappy Bird"
        className="w-full h-full border-0"
      />
    </div>
  );
}


