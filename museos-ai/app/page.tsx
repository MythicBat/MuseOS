"use client";

import { useState } from "react";
import BackgroundGlow from "@/components/BackgroundGlow";
import Hero from "@/components/Hero";
import Studio from "@/components/Studio";

export default function Home() {
  const [studioOpen, setStudioOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <BackgroundGlow />

      {studioOpen ? (
        <Studio onBack={() => setStudioOpen(false)} />
      ) : (
        <Hero onStart={() => setStudioOpen(true)} />
      )}
    </main>
  );
}