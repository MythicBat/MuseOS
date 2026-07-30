"use client";

import type { ReactNode } from "react";

import {
  Bell,
  History,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

interface MuseToolbarProps {
  unreadActivityCount: number;
  hasNotifications: boolean;

  providerLabel?: string;
  providerOnline?: boolean;

  onOpenSpotlight: () => void;
  onOpenActivity: () => void;
  onOpenAlerts?: () => void;
  onOpenSettings: () => void;
}

interface ToolbarButtonProps {
  icon: ReactNode;
  label: string;
  badge?: number;
  active?: boolean;
  shortcut?: string;
  onClick: () => void;
}

export default function MuseToolbar({
  unreadActivityCount,
  hasNotifications,
  providerLabel = "IBM Granite",
  providerOnline = true,
  onOpenSpotlight,
  onOpenActivity,
  onOpenAlerts,
  onOpenSettings,
}: MuseToolbarProps) {
  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -18,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="fixed left-1/2 top-4 z-[150] flex w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 items-center justify-between gap-4 rounded-[26px] border border-white/10 bg-[#11101a]/85 px-3 py-3 shadow-2xl backdrop-blur-2xl sm:px-4 lg:top-5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/10 bg-violet-400/10 text-violet-200 shadow-[0_0_28px_rgba(139,92,246,0.12)]">
          <Sparkles className="h-4.5 w-4.5" />
        </div>

        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-semibold text-white/90">
            MuseOS
          </p>

          <p className="truncate text-[10px] uppercase tracking-[0.16em] text-white/25">
            Creative Operating System
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <ToolbarButton
          icon={
            <Search className="h-4 w-4" />
          }
          label="Search"
          shortcut="⌘K"
          onClick={onOpenSpotlight}
        />

        <ToolbarButton
          icon={
            <History className="h-4 w-4" />
          }
          label="Activity"
          badge={unreadActivityCount}
          onClick={onOpenActivity}
        />

        <ProviderBadge
          label={providerLabel}
          online={providerOnline}
        />

        <ToolbarButton
          icon={
            <Bell className="h-4 w-4" />
          }
          label="Alerts"
          badge={
            hasNotifications
              ? 1
              : undefined
          }
          active={hasNotifications}
          onClick={
            onOpenAlerts ??
            onOpenActivity
          }
        />

        <ToolbarButton
          icon={
            <Settings className="h-4 w-4" />
          }
          label="Settings"
          onClick={onOpenSettings}
        />
      </div>
    </motion.header>
  );
}

function ToolbarButton({
  icon,
  label,
  badge,
  active = false,
  shortcut,
  onClick,
}: ToolbarButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{
        y: -1,
      }}
      whileTap={{
        scale: 0.97,
      }}
      onClick={onClick}
      aria-label={label}
      className={`relative flex h-10 shrink-0 items-center gap-2 rounded-2xl border px-3 transition sm:h-11 ${
        active
          ? "border-violet-300/20 bg-violet-400/10 text-violet-100"
          : "border-white/10 bg-white/[0.035] text-white/45 hover:bg-white/[0.08] hover:text-white/75"
      }`}
    >
      {icon}

      <span className="hidden text-xs md:inline">
        {label}
      </span>

      {shortcut && (
        <span className="ml-1 hidden rounded-lg border border-white/10 bg-black/25 px-1.5 py-0.5 text-[9px] text-white/25 xl:inline">
          {shortcut}
        </span>
      )}

      {badge !== undefined &&
        badge > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-violet-300 px-1 text-[8px] font-semibold text-black shadow-[0_0_12px_rgba(196,181,253,0.65)]">
            {Math.min(
              badge,
              99
            )}
          </span>
        )}
    </motion.button>
  );
}

function ProviderBadge({
  label,
  online,
}: {
  label: string;
  online: boolean;
}) {
  return (
    <div
      className={`hidden h-11 shrink-0 items-center gap-2 rounded-2xl border px-3 lg:flex ${
        online
          ? "border-emerald-300/10 bg-emerald-400/[0.055]"
          : "border-amber-300/10 bg-amber-400/[0.055]"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          online
            ? "bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.75)]"
            : "bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.7)]"
        }`}
      />

      <div>
        <p
          className={`text-[10px] font-medium ${
            online
              ? "text-emerald-100/75"
              : "text-amber-100/75"
          }`}
        >
          {label}
        </p>

        <p className="text-[8px] uppercase tracking-[0.14em] text-white/20">
          {online
            ? "Connected"
            : "Fallback"}
        </p>
      </div>
    </div>
  );
}