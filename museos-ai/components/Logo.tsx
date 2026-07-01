import { Sparkles } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl">
        <Sparkles className="h-5 w-5" />
      </div>
      <span className="text-lg font-semibold tracking-tight">MuseOS</span>
    </div>
  );
}