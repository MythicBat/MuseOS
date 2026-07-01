"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Layers3,
  Play,
  Sparkles,
  Wand2,
} from "lucide-react";
import Logo from "@/components/Logo";

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
      <nav className="flex items-center justify-between">
        <Logo />

        <button
          onClick={onStart}
          className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm text-white/90 backdrop-blur-xl transition hover:bg-white/20"
        >
          Launch Studio
        </button>
      </nav>

      <section className="flex flex-1 items-center py-20">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-xl"
            >
              <Wand2 className="h-4 w-4" />
              AI creative partner, not just a generator
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="max-w-4xl text-6xl font-semibold tracking-tight md:text-7xl lg:text-8xl"
            >
              Turn one idea into an entire creative universe.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-7 max-w-2xl text-lg leading-8 text-white/65"
            >
              MuseOS transforms a single spark into stories, characters, visual
              styles, campaigns, pitch decks, and production-ready creative
              plans through collaborative AI agents.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <button
                onClick={onStart}
                className="group flex items-center gap-2 rounded-full bg-white px-7 py-4 font-medium text-black transition hover:scale-[1.02]"
              >
                Start Creating
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>

              <button className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-7 py-4 font-medium text-white backdrop-blur-xl transition hover:bg-white/20">
                <Play className="h-4 w-4" />
                Watch Demo
              </button>
            </motion.div>
          </div>

          <HeroPreview />
        </div>
      </section>
    </div>
  );
}

function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.25 }}
      className="relative"
    >
      <div className="rounded-[2.5rem] border border-white/15 bg-white/[0.08] p-4 shadow-2xl backdrop-blur-2xl">
        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Creative Canvas</p>
              <h2 className="text-xl font-semibold">Lonely Robot Film</h2>
            </div>

            <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
              Live AI Room
            </div>
          </div>

          <div className="grid gap-4">
            <PreviewCard
              icon={<Layers3 className="h-5 w-5" />}
              title="Story World"
              text="A solar-powered robot discovers music in an abandoned city."
            />
            <PreviewCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Creative DNA"
              text="Warm, cinematic, hopeful, retro-futuristic, family-friendly."
            />
            <PreviewCard
              icon={<Wand2 className="h-5 w-5" />}
              title="AI Agents"
              text="Writer, Art Director, Producer, and Marketing Strategist are collaborating."
            />
          </div>
        </div>
      </div>

      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-fuchsia-400/30 blur-3xl" />
      <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-blue-400/30 blur-3xl" />
    </motion.div>
  );
}

function PreviewCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-white/55">{text}</p>
    </div>
  );
}