import { DNA } from "@/types/creative";

interface CreativeDNAProps {
  dna: DNA;
}

export default function CreativeDNA({ dna }: CreativeDNAProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
      <p className="mb-4 text-sm font-medium text-white/80">Creative DNA</p>

      <div className="space-y-3 text-sm">
        <DNAItem label="Genre" value={dna.genre} />
        <DNAItem label="Tone" value={dna.tone} />
        <DNAItem label="Audience" value={dna.audience} />
        <DNAItem label="Mood" value={dna.mood} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {dna.colors.map((color) => (
          <span
            key={color}
            className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/60"
          >
            {color}
          </span>
        ))}
      </div>
    </div>
  );
}

function DNAItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 rounded-2xl bg-black/20 p-3">
      <span className="text-white/40">{label}</span>
      <span className="text-right text-white/75">{value}</span>
    </div>
  );
}