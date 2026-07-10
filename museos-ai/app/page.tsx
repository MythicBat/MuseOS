"use client";

import { useState } from "react";
import BackgroundGlow from "@/components/BackgroundGlow";
import Hero from "@/components/Hero";
import Studio from "@/components/Studio";
import { AmbientParticles, MouseGlow } from "@/components/ui";

export default function Home() {
  const [studioOpen, setStudioOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050510] text-white">
      <BackgroundGlow />
      <MouseGlow />
      <AmbientParticles />

      <div className="relative z-10">
      {studioOpen ? (
        <Studio onBack={() => setStudioOpen(false)} />
      ) : (
        <Hero onStart={() => setStudioOpen(true)} />
      )}
      </div>
    </main>
  );
}