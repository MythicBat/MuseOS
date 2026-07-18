"use client";

import {
  ArrowRight,
  GitCompare,
  Plus,
  Minus,
  RefreshCw,
  X,
} from "lucide-react";

import {
  CreativeVersionComparison,
  DNA,
} from "@/types/creative";

interface VersionCompareModalProps {
  comparison: CreativeVersionComparison;
  onClose: () => void;
}

function formatDNAField(
  field: keyof DNA
) {
  const labels: Record<keyof DNA, string> = {
    genre: "Genre",
    tone: "Tone",
    audience: "Audience",
    mood: "Mood",
    colors: "Visual Palette",
  };

  return labels[field];
}

function formatValue(
  value: string | string[]
) {
  return Array.isArray(value)
    ? value.join(", ")
    : value;
}

export default function VersionCompareModal({
  comparison,
  onClose,
}: VersionCompareModalProps) {
  const {
    fromVersion,
    toVersion,
    dnaDifferences,
    addedNodes,
    removedNodes,
    changedNodes,
  } = comparison;

  const hasChanges =
    dnaDifferences.length > 0 ||
    addedNodes.length > 0 ||
    removedNodes.length > 0 ||
    changedNodes.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[32px] border border-white/15 bg-[#12111a] p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-violet-200">
              <GitCompare className="h-4 w-4" />
              <span className="text-sm">
                Version Comparison
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-white">
                {fromVersion.label}
              </h2>

              <ArrowRight className="h-4 w-4 text-white/30" />

              <h2 className="text-xl font-semibold text-white">
                {toVersion.label}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!hasChanges && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-sm text-white/50">
            These versions contain no visible differences.
          </div>
        )}

        {dnaDifferences.length > 0 && (
          <section className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-white/80">
              Creative DNA changes
            </h3>

            <div className="space-y-3">
              {dnaDifferences.map((difference) => (
                <div
                  key={difference.field}
                  className="grid gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 md:grid-cols-[140px_1fr_auto_1fr]"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-white/35">
                    {formatDNAField(
                      difference.field
                    )}
                  </p>

                  <p className="text-sm text-red-200/70">
                    {formatValue(
                      difference.before
                    )}
                  </p>

                  <ArrowRight className="hidden h-4 w-4 text-white/25 md:block" />

                  <p className="text-sm text-emerald-200/80">
                    {formatValue(
                      difference.after
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          <DifferenceColumn
            title="Added nodes"
            icon={
              <Plus className="h-4 w-4" />
            }
            items={addedNodes.map((node) => ({
              id: node.id,
              title: node.title,
              description: node.subtitle,
            }))}
            emptyText="No nodes added"
          />

          <DifferenceColumn
            title="Removed nodes"
            icon={
              <Minus className="h-4 w-4" />
            }
            items={removedNodes.map((node) => ({
              id: node.id,
              title: node.title,
              description: node.subtitle,
            }))}
            emptyText="No nodes removed"
          />

          <DifferenceColumn
            title="Changed nodes"
            icon={
              <RefreshCw className="h-4 w-4" />
            }
            items={changedNodes.map(
              ({ before, after }) => ({
                id: after.id,
                title: after.title,
                description:
                  before.subtitle ===
                  after.subtitle
                    ? "Position or node metadata changed."
                    : `${before.subtitle} → ${after.subtitle}`,
              })
            )}
            emptyText="No nodes changed"
          />
        </div>
      </div>
    </div>
  );
}

interface DifferenceColumnProps {
  title: string;
  icon: React.ReactNode;
  items: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  emptyText: string;
}

function DifferenceColumn({
  title,
  icon,
  items,
  emptyText,
}: DifferenceColumnProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm text-white/75">
        {icon}
        {title}
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 p-4 text-xs text-white/30">
            {emptyText}
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
            >
              <p className="text-sm font-medium text-white/75">
                {item.title}
              </p>

              <p className="mt-1 text-xs leading-5 text-white/40">
                {item.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}