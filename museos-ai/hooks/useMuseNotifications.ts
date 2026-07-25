"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  CreateMuseNotification,
  MuseNotification,
} from "@/types/notifications";

export function useMuseNotifications() {
  const [
    notifications,
    setNotifications,
  ] = useState<MuseNotification[]>([]);

  const timeoutIdsRef =
    useRef<Map<string, number>>(
      new Map()
    );

  const dismissNotification =
    useCallback((id: string) => {
      const timeoutId =
        timeoutIdsRef.current.get(id);

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
        timeoutIdsRef.current.delete(id);
      }

      setNotifications((current) =>
        current.filter(
          (notification) =>
            notification.id !== id
        )
      );
    }, []);

  const notify = useCallback(
    (
      input: CreateMuseNotification
    ): string => {
      const id =
        input.id ??
        crypto.randomUUID();

      const notification: MuseNotification = {
        id,
        type: input.type ?? "info",
        title: input.title,
        message: input.message,
        createdAt: Date.now(),
        duration: input.duration ?? 4200,
        persistent: input.persistent ?? false,
      };

      const existingTimeout =
        timeoutIdsRef.current.get(id);

      if (
        existingTimeout !== undefined
      ) {
        window.clearTimeout(
          existingTimeout
        );

        timeoutIdsRef.current.delete(id);
      }

      setNotifications((current) => {
        const existingIndex =
          current.findIndex(
            (item) => item.id === id
          );

        if (existingIndex === -1) {
          return [
            notification,
            ...current,
          ].slice(0, 5);
        }

        return current.map((item) =>
          item.id === id
            ? notification
            : item
        );
      });

      if (!notification.persistent) {
        const timeoutId =
          window.setTimeout(() => {
            dismissNotification(id);
          }, notification.duration);

        timeoutIdsRef.current.set(
          id,
          timeoutId
        );
      }

      return id;
    },
    [dismissNotification]
  );

  const updateNotification =
    useCallback(
      (
        id: string,
        input: Omit<
          CreateMuseNotification,
          "id"
        >
      ) => {
        notify({
          ...input,
          id,
        });
      },
      [notify]
    );

  const clearNotifications =
    useCallback(() => {
      timeoutIdsRef.current.forEach(
        (timeoutId) => {
          window.clearTimeout(
            timeoutId
          );
        }
      );

      timeoutIdsRef.current.clear();

      setNotifications([]);
    }, []);

  return {
    notifications,
    notify,
    updateNotification,
    dismissNotification,
    clearNotifications,
  };
}