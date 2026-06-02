"use client";

import { useState } from "react";

export default function CarRaceLoaderPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="pt-24 md:pt-28 pb-2 text-center">
        <h1 className="text-xl font-semibold">Car race</h1>
      </div>
      {!loaded && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse text-lg">Loading game...</div>
          </div>
        </div>
      )}
      <iframe
        src="/car-race"
        title="Car race"
        className="flex-1 w-full border-0"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}


