interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-[32px]
        border
        border-white/10
        bg-white/[0.06]
        backdrop-blur-3xl
        shadow-[0_0_80px_rgba(255,255,255,0.03)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}