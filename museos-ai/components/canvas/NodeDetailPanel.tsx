"use client";

import { X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { CanvasNode } from "@/types/creative";

interface NodeDetailPanelProps {
    node: CanvasNode;
    onClose: () => void;
}

export default function NodeDetailPanel({
    node,
    onClose,
} : NodeDetailPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            className="absolute right-5 top-5 z-30 w-full max-w-sm rounded-[32px] border border-white/10 bg-[#11111d]/90 p-5 shadow-2xl backdrop-blur-2xl"
        >
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <p className="mb-2 text-sm text-white/40">Selected Node</p>
                    <h2 className="text-2xl font-semibold tracking-tight">{node.title}</h2>
                </div>

                <button
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <Sparkles className="h-5 w-5" />
                </div>

                <p className="text-sm leading-7 text-white/65">{node.subtitle}</p>
            </div>

            <button className="mt-5 w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.01]">
                Expand this Branch
            </button>
        </motion.div>
    );
}