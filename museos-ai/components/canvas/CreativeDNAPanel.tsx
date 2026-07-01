import { DNA } from "@/types/creative";

interface CreativeDNAPanelProps {
  dna: DNA;
}

export default function CreativeDNAPanel({ dna }: CreativeDNAPanelProps) {
  return (
    <div className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
      <p className="mb-4 text-sm font-medium text-white/80">Creative DNA</p>

      <div className="grid gap-3 md:grid-cols-4">
        <DNAItem label="Genre" value={dna.genre} />
        <DNAItem label="Tone" value={dna.tone} />
        <DNAItem label="Audience" value={dna.audience} />
        <DNAItem label="Mood" value={dna.mood} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
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
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="mb-2 text-xs text-white/40">{label}</p>
      <p className="text-sm leading-6 text-white/75">{value}</p>
    </div>
  );
}