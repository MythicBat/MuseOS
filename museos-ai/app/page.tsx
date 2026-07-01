"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Clapperboard,
  Layers3,
  Megaphone,
  Palette,
  Play,
  Sparkles,
  Wand2,
} from "lucide-react";

const sampleProject = {
  title: "Lonely Robot Film",
  idea: "A lonely solar-powered robot discovers music in an abandoned city.",
  dna: {
    genre: "Animated Sci-Fi Drama",
    tone: "Warm, hopeful, emotional",
    audience: "Families, students, young creators",
    mood: "Cinematic, quiet, magical",
    colors: ["Amber", "Midnight Blue", "Soft Silver"],
  },
  sections: [
    {
      title: "Story",
      icon: <Clapperboard className="h-5 w-5" />,
      text: "A forgotten maintenance robot finds an old vinyl record and slowly learns that creativity can bring a sleeping city back to life.",
    },
    {
      title: "Characters",
      icon: <Brain className="h-5 w-5" />,
      text: "NOVA, a curious robot. LUMA, a holographic singer. The City, almost a character itself.",
    },
    {
      title: "Visual Style",
      icon: <Palette className="h-5 w-5" />,
      text: "Apple-like minimal futurism mixed with warm Pixar-style emotional lighting and retro machinery.",
    },
    {
      title: "Marketing",
      icon: <Megaphone className="h-5 w-5" />,
      text: "Positioned as a short animated film about loneliness, imagination, and finding your voice.",
    },
  ],
  agents: [
    {
      role: "Writer",
      message:
        "The emotional hook should be NOVA hearing music for the first time and not understanding why it feels familiar.",
    },
    {
      role: "Art Director",
      message:
        "The city should feel cold at first, then slowly become warmer as music spreads through the environment.",
    },
    {
      role: "Producer",
      message:
        "This works well as a 3-minute animated proof of concept with one hero location and two main characters.",
    },
    {
      role: "Marketing Strategist",
      message:
        "The strongest angle is: what if creativity was the last thing left alive in a dead city?",
    },
  ],
};

export default function Home() {
  const [studioOpen, setStudioOpen] = useState(false);
  const [idea, setIdea] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!idea.trim()) return;
    setGenerated(true);
  };

  if (studioOpen) {
    return (
      <main className="min-h-screen bg-[#050510] text-white">
        <BackgroundGlow />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
          <nav className="mb-10 flex items-center justify-between">
            <Logo />
            <button
              onClick={() => setStudioOpen(false)}
              className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/20"
            >
              Back Home
            </button>
          </nav>

          <section className="grid gap-8 lg:grid-cols-[0.9fr_1.5fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 backdrop-blur-2xl"
            >
              <div className="mb-6">
                <p className="mb-2 text-sm text-white/50">MuseOS Studio</p>
                <h1 className="text-4xl font-semibold tracking-tight">
                  Start with one spark.
                </h1>
                <p className="mt-4 leading-7 text-white/60">
                  Enter any creative idea. MuseOS will transform it into a
                  story world, creative DNA, agent feedback, and production
                  plan.
                </p>
              </div>

              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Example: A children’s animated film about a lonely robot who discovers music..."
                className="min-h-44 w-full resize-none rounded-3xl border border-white/10 bg-black/30 p-5 text-white outline-none backdrop-blur-xl placeholder:text-white/35 focus:border-white/30"
              />

              <button
                onClick={handleGenerate}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 font-medium text-black transition hover:scale-[1.01]"
              >
                Generate Creative Universe
                <Sparkles className="h-4 w-4" />
              </button>

              <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
                <p className="mb-3 text-sm font-medium text-white/80">
                  Demo Tip
                </p>
                <p className="text-sm leading-6 text-white/50">
                  For now, this screen uses polished placeholder AI output. In
                  the next phase, we will connect it to a real AI API route.
                </p>
              </div>
            </motion.div>

            <section className="min-h-[680px] rounded-[2.5rem] border border-white/15 bg-white/[0.05] p-5 backdrop-blur-2xl">
              {!generated ? (
                <EmptyCanvas />
              ) : (
                <GeneratedCanvas userIdea={idea} />
              )}
            </section>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <BackgroundGlow />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <Logo />

          <button
            onClick={() => setStudioOpen(true)}
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
                MuseOS transforms a single spark into stories, characters,
                visual styles, campaigns, pitch decks, and production-ready
                creative plans through collaborative AI agents.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <button
                  onClick={() => setStudioOpen(true)}
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
    </main>
  );
}

function GeneratedCanvas({ userIdea }: { userIdea: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid h-full gap-5 xl:grid-cols-[1.2fr_0.8fr]"
    >
      <div className="space-y-5">
        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
          <p className="mb-2 text-sm text-white/45">Generated from your idea</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            {sampleProject.title}
          </h2>
          <p className="mt-4 leading-7 text-white/60">{userIdea}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sampleProject.sections.map((section) => (
            <CreativeCard
              key={section.title}
              icon={section.icon}
              title={section.title}
              text={section.text}
            />
          ))}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <p className="mb-4 text-sm font-medium text-white/80">
            One-Click Outputs
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Pitch Summary", "Storyboard", "Social Campaign", "Project Brief"].map(
              (item) => (
                <button
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/10"
                >
                  Generate {item}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <CreativeDNA />

        <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
          <p className="mb-4 text-sm font-medium text-white/80">
            AI Creative Room
          </p>
          <div className="space-y-3">
            {sampleProject.agents.map((agent) => (
              <div
                key={agent.role}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
              >
                <p className="mb-2 text-sm font-medium">{agent.role}</p>
                <p className="text-sm leading-6 text-white/55">
                  {agent.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CreativeDNA() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
      <p className="mb-4 text-sm font-medium text-white/80">Creative DNA</p>

      <div className="space-y-3 text-sm">
        <DNAItem label="Genre" value={sampleProject.dna.genre} />
        <DNAItem label="Tone" value={sampleProject.dna.tone} />
        <DNAItem label="Audience" value={sampleProject.dna.audience} />
        <DNAItem label="Mood" value={sampleProject.dna.mood} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {sampleProject.dna.colors.map((color) => (
          <span
            key={color}
            className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/60"
          >
            {color}
          </span>
        ))}
      </div>
    </div>
  );
}

function DNAItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 rounded-2xl bg-black/20 p-3">
      <span className="text-white/40">{label}</span>
      <span className="text-right text-white/75">{value}</span>
    </div>
  );
}

function EmptyCanvas() {
  return (
    <div className="flex h-full min-h-[640px] items-center justify-center rounded-[2rem] border border-dashed border-white/15 bg-black/20">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight">
          Your creative universe will appear here.
        </h2>
        <p className="mt-4 leading-7 text-white/50">
          Add an idea on the left and MuseOS will generate a connected creative
          workspace.
        </p>
      </div>
    </div>
  );
}

function CreativeCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-white/55">{text}</p>
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

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl">
        <Sparkles className="h-5 w-5" />
      </div>
      <span className="text-lg font-semibold tracking-tight">MuseOS</span>
    </div>
  );
}

function BackgroundGlow() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(112,97,255,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(255,96,180,0.25),transparent_30%),radial-gradient(circle_at_bottom,rgba(70,180,255,0.18),transparent_35%)]" />
  );
}