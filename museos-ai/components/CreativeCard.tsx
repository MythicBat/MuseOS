import { ReactNode } from "react";

interface CreativeCardProps {
  icon: ReactNode;
  title: string;
  text: string;
}

export default function CreativeCard({
  icon,
  title,
  text,
}: CreativeCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-white/55">{text}</p>
    </div>
  );
}