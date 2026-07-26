"use client";

import { useState } from "react";

import {
    AlertCircle,
    Check,
    Clapperboard,
    Download,
    History,
    Layers3,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import { MuseActivity, MuseActivityType } from "@/types/activity";

interface MuseActivityCenterProps {
    open: boolean;
    activities: MuseActivity[];
    unreadCount: number;
    onClose: () => void;
    onClear: () => void;
    onDelete: (activityId: string) => void;
    onMarkRead: (activityId: string) => void;
    onMarkAllRead: () => void;
}

export default function MuseActivityCenter({
    open,
    activities,
    unreadCount,
    onClose,
    onClear,
    onDelete,
    onMarkAllRead,
    onMarkRead,
} : MuseActivityCenterProps) {
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const visibleActivities = showUnreadOnly ? activities.filter((activity) => !activity.readAt) : activities;
    const activityGroups = groupActivitiesByDate(visibleActivities);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.button
                        type="button"
                        aria-label="Close Activity Center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[210] cursor-default bg-black/65 backdrop-blur-md"
                    />

                    <motion.aside
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.22, ease: "easeOut"}}
                        className="fixed bottom-4 right-4 top-4 z-[220] flex w-[calc(100%-2rem)] max-w-md flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#11101a]/98 shadow-2xl backdrop-blur-2xl"
                    >
                        <header className="flex items-center justify-between border-b border-white/10 p-5">
                            <div>
                                <div className="flex items-center gap-2 text-white/80">
                                    <History className="h-4 w-4" />

                                    <p className="text-sm font-medium">Activity Center</p>
                                </div>

                                <div className="mt-1 flex items-center gap-2 text-xs text-white/30">
                                    <span>
                                        {activities.length} recent{" "}
                                        {activities.length === 1 ? "event" : "events"}
                                    </span>

                                    {unreadCount > 0 && (
                                        <>
                                            <span>•</span>

                                            <span className="text-violet-200/60">{unreadCount} unread</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={onMarkAllRead}
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] text-white/45 transition hover:bg-white/10 hover:text-white/70"
                                    >
                                        Mark all read
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-full border border-white/10 bg-white/5 p-2 text-white/40 transition hover:bg-white/10 hover:text-white/70"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </header>

                        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                            <button
                                type="button"
                                onClick={() => setShowUnreadOnly(false)}
                                className={`rounded-full px-3 py-1.5 text-[10px] transition ${
                                    !showUnreadOnly ? "bg-white text-black" : "border border-white/10 bg-white/5 text-white/40 hover:bg-white/10"
                                }`}
                            >
                                All
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowUnreadOnly(true)}
                                className={`rounded-full px-3 py-1.5 text-[10px] transition ${
                                    showUnreadOnly ? "bg-white text-black" : "border border-white/10 bg-white/5 text-white/40 hover:bg-white/10"
                                }`}
                            >
                                Unread
                                {unreadCount > 0 ? `${unreadCount}` : ""}
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {visibleActivities.length === 0 ? (<EmptyActivityState unreadOnly={showUnreadOnly} />) : (
                                <div className="space-y-7">
                                    {activityGroups.map((group) => (
                                        <section key={group.label}>
                                            <div className="mb-3 flex items-center gap-3">
                                                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/25">{group.label}</p>

                                                <div className="h-px flex-1 bg-white/[0.06]" />
                                            </div>

                                            <div className="space-y-3">
                                                {group.activities.map((activity) => (
                                                    <ActivityCard
                                                        key={activity.id}
                                                        activity={activity}
                                                        onDelete={onDelete}
                                                        onMarkRead={onMarkRead}
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            )}
                        </div>

                        {activities.length > 0 && (
                            <footer className="border-t border-white/10 p-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const confirmed = window.confirm("Clear all MuseOS activity?");

                                        if (confirmed) { onClear(); }
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-full border border-red-300/10 bg-red-400/[0.05] px-4 py-3 text-xs text-red-200/50 transition hover:bg-red-400/10"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Clear Activity
                                </button>
                            </footer>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

function ActivityCard({
    activity,
    onDelete,
    onMarkRead,
}: {
    activity: MuseActivity;
    onDelete: (activityId: string) => void;
    onMarkRead: (activityId: string) => void;
}) {
    const unread = !activity.readAt;

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            onClick={() => {
                if (unread) { onMarkRead(activity.id); }
            }}
            className={`group relative rounded-[22px] border p-4 transition ${
                unread ? "border-violet-300/20 bg-violet-400/[0.07]" : "border-white/10 bg-white/[0.035]"
            }`}
        >
            {unread && (
                <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(196,181,253,0.8)]" />
            )}

            <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${getActivityIconClass(activity)}`}>
                    <ActivityIcon activity={activity} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-white/75">{activity.title}</p>

                        <button
                            type="button"
                            aria-label="Delete Activity"
                            onClick={(event) => {
                                event.stopPropagation();
                                onDelete(activity.id);
                            }}
                            className="rounded-full p-1 text-white/0 transition group-hover:text-white/25 hover:bg-white/10 hover:!text-white/60"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>

                    {activity.message && (
                        <p className="mt-1 text-xs leading-5 text-white/35">{activity.message}</p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-white/25">
                        {activity.projectTitle && (
                            <>
                                <span className="max-w-[180px] truncate">{activity.projectTitle}</span>

                                <span>•</span>
                            </>
                        )}

                        <span>
                            {formatActivityDate(activity.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

interface ActivityGroup {
    label: string;
    activities: MuseActivity[];
}

function groupActivitiesByDate(activities: MuseActivity[]): ActivityGroup[] {
    const groups = new Map<string,MuseActivity[]>();

    activities.forEach((activity) => {
        const label = getActivityGroupLabel(activity.createdAt);

        const currentGroup = groups.get(label) ?? [];

        currentGroup.push(activity);
        groups.set(
            label,
            currentGroup,
        );
    });

    return Array.from(groups.entries()).map(
        ([label, groupedActivities]) => ({
            label,
            activities: groupedActivities,
        })
    );
}

function getActivityGroupLabel(timestamp: number): string {
    const date = new Date(timestamp);

    const now = new Date();

    const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const activityStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const differenceInDays = Math.round((todayStart.getTime() - activityStart.getTime())/86_400_000);

    if (differenceInDays === 0) { return "Today"; }
    if (differenceInDays === 1) { return "Yesterday"; }
    if (differenceInDays < 7) {
        return new Intl.DateTimeFormat(undefined, {weekday: "long"}).format(date);
    }

    return new Intl.DateTimeFormat(undefined, {month: "long", year: "numeric"}).format(date);
}

function EmptyActivityState({
    unreadOnly,
}: { unreadOnly: boolean; }) {
    return (
        <div className="flex min-h-[360px] flex-col items-center justify-center px-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] border border-white/10 bg-white/5 text-white/35">
                <Sparkles className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-medium text-white/70">
                {unreadOnly ? "You're all caught up" : "No activity yet"}
            </h3>

            <p className="mt-2 max-w-xs text-xs leading-5 text-white/30">
                {unreadOnly ? "There are no unread MuseOS events." : "Generations, exports and project changes will appear here."}
            </p>
        </div>
    );
}

function ActivityIcon({
    activity,
} : {
    activity: MuseActivity;
}) {
    if (activity.status === "error") {
        return (<AlertCircle className="h-4 w-4" />);
    }

    if (activity.status === "success") {
        return (<Check className="h-4 w-4" />);
    }

    switch (activity.type) {
        case "generation":
            return (<Clapperboard className="h-4 w-4" />);
        case "export":
            return (<Download className="h-4 w-4" />);
        case "project":
            return (<Layers3 className="h-4 w-4" />);
        default:
            return (<Sparkles className="h-4 w-4" />);
    }
}

function getActivityIconClass(activity: MuseActivity): string {
    if (activity.status === "error") {
        return "bg-red-400/10 text-red-200";
    }

    if (activity.status === "success") {
        return "bg-emerald-400/10 text-emerald-200";
    }

    return "bg-violet-400/10 text-violet-200";
}

function formatActivityDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
        return new Intl.DateTimeFormat(undefined, {
            hour: "numeric",
            minute: "2-digit",
        }).format(date);
    }

    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}