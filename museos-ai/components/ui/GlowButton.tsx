"use client";

import { motion } from "framer-motion";

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function GlowButton({
  children,
  onClick,
  disabled = false,
}: GlowButtonProps) {
  return (
    <motion.button
      whileHover={{
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      disabled={disabled}
      onClick={onClick}
      className="
      relative
      overflow-hidden
      rounded-full
      bg-white
      px-8
      py-4
      font-medium
      text-black
      disabled:opacity-50
      disabled:cursor-not-allowed
      "
    >
      {children}
    </motion.button>
  );
}