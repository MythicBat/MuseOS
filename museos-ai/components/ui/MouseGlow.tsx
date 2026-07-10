"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MouseGlow() {
    const [position, setPosition] = useState({
        x: -300,
        y: -300,
    });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setPosition({
                x: event.clientX,
                y: event.clientY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <motion.div
            animate={{
                x: position.x - 220,
                y: position.y - 220,
            }}
            transition={{
                type: "spring",
                stiffness: 70,
                damping: 24,
                mass: 0.4,
            }}
            className="pointer-events-none fixed left-0 top-0 z-0 h-[440px] w-[440px] rounded-full bg-violet-500/10 blur-[120px]"
        />
    );
}