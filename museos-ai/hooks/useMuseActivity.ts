"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CreateMuseActivity,
  MuseActivity,
} from "@/types/activity";

const STORAGE_KEY =
  "museos-system-activity";

const MAX_ACTIVITY_ITEMS = 100;

export function useMuseActivity() {
  const [activities, setActivities] = useState<MuseActivity[]>(() => {
    if (typeof window === "undefined") { return []; }

    try {
        const savedValue = window.localStorage.getItem(STORAGE_KEY);

        if (!savedValue) { return []; }

        const parsedValue: unknown = JSON.parse(savedValue);

        if (!Array.isArray(parsedValue)) { return []; }

        return parsedValue.filter(isMuseActivity);
    } catch {
        window.localStorage.removeItem(STORAGE_KEY);

        return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(activities)
      );
    } catch {
      // Activity history is non-critical.
      // MuseOS should continue working
      // if browser storage is unavailable.
    }
  }, [activities]);

  const addActivity =
    useCallback(
      (
        input: CreateMuseActivity
      ): string => {
        const id =
          input.id ??
          crypto.randomUUID();

        const activity: MuseActivity = {
          id,
          type: input.type,
          status:
            input.status ?? "info",
          title: input.title,
          message: input.message,
          projectId:
            input.projectId,
          projectTitle:
            input.projectTitle,
          createdAt: Date.now(),
        };

        setActivities((current) =>
          [
            activity,
            ...current,
          ].slice(
            0,
            MAX_ACTIVITY_ITEMS
          )
        );

        return id;
      },
      []
    );

  const deleteActivity =
    useCallback((id: string) => {
      setActivities((current) =>
        current.filter(
          (activity) =>
            activity.id !== id
        )
      );
    }, []);

  const clearActivities =
    useCallback(() => {
      setActivities([]);
    }, []);

  return {
    activities,
    addActivity,
    deleteActivity,
    clearActivities,
  };
}

function isMuseActivity(
  value: unknown
): value is MuseActivity {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Partial<MuseActivity>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.type === "string" &&
    typeof candidate.status === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.createdAt ===
      "number"
  );
}