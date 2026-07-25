"use client";

import {
  AlertTriangle,
  Check,
  Info,
  LoaderCircle,
  X,
  XCircle,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  MuseNotification,
  MuseNotificationType,
} from "@/types/notifications";

interface MuseNotificationCenterProps {
  notifications: MuseNotification[];

  onDismiss: (
    notificationId: string
  ) => void;
}

export default function MuseNotificationCenter({
  notifications,
  onDismiss,
}: MuseNotificationCenterProps) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[250] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-3">
      <AnimatePresence initial={false}>
        {notifications.map(
          (notification) => (
            <motion.article
              layout
              key={notification.id}
              initial={{
                opacity: 0,
                x: 30,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: 30,
                scale: 0.96,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="pointer-events-auto overflow-hidden rounded-[22px] border border-white/10 bg-[#17151f]/95 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-start gap-3 p-4">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${getIconContainerClass(
                    notification.type
                  )}`}
                >
                  <NotificationIcon
                    type={
                      notification.type
                    }
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white/85">
                    {
                      notification.title
                    }
                  </p>

                  {notification.message && (
                    <p className="mt-1 text-xs leading-5 text-white/40">
                      {
                        notification.message
                      }
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() =>
                    onDismiss(
                      notification.id
                    )
                  }
                  className="rounded-full p-1.5 text-white/25 transition hover:bg-white/10 hover:text-white/60"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {!notification.persistent &&
                notification.type !==
                  "loading" && (
                  <motion.div
                    initial={{
                      scaleX: 1,
                    }}
                    animate={{
                      scaleX: 0,
                    }}
                    transition={{
                      duration:
                        (notification.duration ??
                          4200) / 1000,
                      ease: "linear",
                    }}
                    className="h-px origin-left bg-white/15"
                  />
                )}
            </motion.article>
          )
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationIcon({
  type,
}: {
  type: MuseNotificationType;
}) {
  switch (type) {
    case "success":
      return (
        <Check className="h-4 w-4" />
      );

    case "error":
      return (
        <XCircle className="h-4 w-4" />
      );

    case "warning":
      return (
        <AlertTriangle className="h-4 w-4" />
      );

    case "loading":
      return (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      );

    default:
      return (
        <Info className="h-4 w-4" />
      );
  }
}

function getIconContainerClass(
  type: MuseNotificationType
): string {
  switch (type) {
    case "success":
      return "bg-emerald-400/10 text-emerald-200";

    case "error":
      return "bg-red-400/10 text-red-200";

    case "warning":
      return "bg-amber-400/10 text-amber-200";

    case "loading":
      return "bg-violet-400/10 text-violet-200";

    default:
      return "bg-sky-400/10 text-sky-200";
  }
}