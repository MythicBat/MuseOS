"use client";

import {
  Bot,
  ChevronLeft,
  Clapperboard,
  Download,
  Fingerprint,
  Frame,
  History,
  LayoutDashboard,
  PanelsTopLeft,
  Presentation,
  Settings,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface WorkspaceSidebarProps {
  projectTitle?: string;
  onBack: () => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}

const workspaceItems: SidebarItem[] = [
  {
    id: "workspace-canvas",
    label: "Canvas",
    icon: PanelsTopLeft,
  },
  {
    id: "workspace-agents",
    label: "Agents",
    icon: Bot,
  },
  {
    id: "workspace-dna",
    label: "Creative DNA",
    icon: Fingerprint,
  },
  {
    id: "workspace-versioning",
    label: "Versioning",
    icon: History,
  },
  {
    id: "workspace-production",
    label: "Production",
    icon: Clapperboard,
  },
  {
    id: "workspace-storyboards",
    label: "Storyboards",
    icon: Frame,
  },
  {
    id: "workspace-pitch-deck",
    label: "Pitch Deck",
    icon: Presentation,
  },
  {
    id: "workspace-exports",
    label: "Exports",
    icon: Download,
  },
  {
    id: "workspace-settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function WorkspaceSidebar({
  projectTitle,
  onBack,
}: WorkspaceSidebarProps) {
  const [activeSection, setActiveSection] =
    useState("workspace-canvas");

  useEffect(() => {
    const sections = workspaceItems
      .map((item) =>
        document.getElementById(item.id)
      )
      .filter(
        (
          element
        ): element is HTMLElement =>
          Boolean(element)
      );

    if (sections.length === 0) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visibleEntry = entries
            .filter(
              (entry) =>
                entry.isIntersecting
            )
            .sort(
              (first, second) =>
                second.intersectionRatio -
                first.intersectionRatio
            )[0];

          if (visibleEntry) {
            setActiveSection(
              visibleEntry.target.id
            );
          }
        },
        {
          rootMargin:
            "-20% 0px -60% 0px",
          threshold: [
            0.05,
            0.15,
            0.3,
            0.5,
          ],
        }
      );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const navigateToSection = (
    sectionId: string
  ) => {
    const element =
      document.getElementById(
        sectionId
      );

    if (!element) {
      return;
    }

    setActiveSection(sectionId);

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-[230px] shrink-0 flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.055] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-3xl lg:flex">
        <div className="rounded-[22px] border border-white/[0.08] bg-black/20 p-4">
          <div className="flex items-center gap-2 text-violet-200/65">
            <Sparkles className="h-3.5 w-3.5" />

            <span className="text-[9px] font-medium uppercase tracking-[0.18em]">
              Active universe
            </span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm font-medium leading-5 text-white/80">
            {projectTitle ||
              "New creative universe"}
          </p>

          <div className="mt-3 flex items-center gap-2 text-[10px] text-white/30">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300/80" />
            MuseOS workspace
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.07] hover:text-white/75"
        >
          <ChevronLeft className="h-4 w-4" />
          Projects
        </button>

        <div className="my-3 h-px bg-white/[0.07]" />

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto">
          {workspaceItems.map(
            (item) => {
              const Icon = item.icon;

              const isActive =
                activeSection ===
                item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    navigateToSection(
                      item.id
                    )
                  }
                  className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5 text-left text-xs transition ${
                    isActive
                      ? "text-white"
                      : "text-white/35 hover:bg-white/[0.055] hover:text-white/70"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="workspace-sidebar-active"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-2xl border border-white/10 bg-white/[0.09]"
                    />
                  )}

                  <span
                    className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-xl transition ${
                      isActive
                        ? "bg-violet-300/15 text-violet-100"
                        : "bg-white/[0.035] text-white/35 group-hover:text-white/65"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>

                  <span className="relative z-10">
                    {item.label}
                  </span>

                  {isActive && (
                    <motion.span
                      layoutId="workspace-sidebar-dot"
                      className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-violet-200"
                    />
                  )}
                </button>
              );
            }
          )}
        </nav>

        <div className="mt-3 rounded-2xl border border-white/[0.07] bg-black/15 p-3">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.14em] text-white/20">
            <span>AI engine</span>
            <span className="text-blue-200/45">
              Granite
            </span>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              animate={{
                x: [
                  "-100%",
                  "260%",
                ],
              }}
              transition={{
                duration: 3,
                repeat:
                  Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-blue-200/60 to-transparent"
            />
          </div>
        </div>
      </aside>

      <MobileWorkspaceNavigation
        activeSection={activeSection}
        onNavigate={navigateToSection}
        onBack={onBack}
      />
    </>
  );
}

interface MobileWorkspaceNavigationProps {
  activeSection: string;
  onNavigate: (
    sectionId: string
  ) => void;
  onBack: () => void;
}

function MobileWorkspaceNavigation({
  activeSection,
  onNavigate,
  onBack,
}: MobileWorkspaceNavigationProps) {
  return (
    <div className="sticky top-3 z-50 mb-5 rounded-[22px] border border-white/10 bg-[#11101a]/85 p-2 shadow-2xl backdrop-blur-3xl lg:hidden">
      <div className="flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to projects"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/50"
        >
          <LayoutDashboard className="h-4 w-4" />
        </button>

        {workspaceItems.map(
          (item) => {
            const Icon = item.icon;

            const isActive =
              activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onNavigate(item.id)
                }
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-[10px] transition ${
                  isActive
                    ? "bg-white text-black"
                    : "bg-white/[0.045] text-white/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}