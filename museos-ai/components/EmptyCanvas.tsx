import { Sparkles } from "lucide-react";

export default function EmptyCanvas() {
  return (
    <div className="flex h-full min-h-[640px] items-center justify-center rounded-[2rem] border border-dashed border-white/15 bg-black/20">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight">
          Your creative universe will appear here.
        </h2>
        <p className="mt-4 leading-7 text-white/50">
          Add an idea on the left and MuseOS will generate a connected creative
          workspace.
        </p>
      </div>
    </div>
  );
}