interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function GradientText({
  children,
  className = "",
}: GradientTextProps) {
  return (
    <span
      className={`
      bg-gradient-to-r
      from-white
      via-blue-200
      to-violet-300
      bg-clip-text
      text-transparent
      ${className}
      `}
    >
      {children}
    </span>
  );
}