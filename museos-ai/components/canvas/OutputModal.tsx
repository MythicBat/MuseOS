"use client";

import { motion } from "framer-motion";
import { X, Copy } from "lucide-react";

interface OutputModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

export default function OutputModal({
  title,
  content,
  onClose,
}: OutputModalProps) {
  const copyContent = async () => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#11111d] p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/40">MuseOS Export</p>
            <h2 className="text-2xl font-semibold">{title}</h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <p className="whitespace-pre-line leading-7 text-white/70">
            {content}
          </p>
        </div>

        <button
          onClick={copyContent}
          className="mt-5 flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
        >
          <Copy className="h-4 w-4" />
          Copy Output
        </button>
      </motion.div>
    </div>
  );
}