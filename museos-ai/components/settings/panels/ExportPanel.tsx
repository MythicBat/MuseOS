"use client";

import {
  BadgeCheck,
  Check,
  FileArchive,
  FileText,
  FolderOpen,
  ImageDown,
  MonitorUp,
  Presentation,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type {
  ExportFormat,
  ExportQuality,
  MuseSettings,
  PdfPageSize,
} from "@/types/settings";

interface ExportPanelProps {
  settings: MuseSettings["export"];

  onChange: (
    updates: Partial<MuseSettings["export"]>
  ) => void;
}

interface FormatOption {
  id: ExportFormat;
  label: string;
  extension: string;
  description: string;
  icon: typeof FileText;
}

interface QualityOption {
  id: ExportQuality;
  label: string;
  description: string;
  detail: string;
}

interface PageSizeOption {
  id: PdfPageSize;
  label: string;
  dimensions: string;
  description: string;
}

const formatOptions: FormatOption[] = [
  {
    id: "pdf",
    label: "PDF",
    extension: ".pdf",
    description:
      "Best for polished documents, creative briefs and storyboards.",
    icon: FileText,
  },
  {
    id: "pptx",
    label: "PowerPoint",
    extension: ".pptx",
    description:
      "Best for editable pitch decks and presentations.",
    icon: Presentation,
  },
  {
    id: "markdown",
    label: "Markdown",
    extension: ".md",
    description:
      "Best for portable text, documentation and version control.",
    icon: FileArchive,
  },
  {
    id: "docx",
    label: "Word",
    extension: ".docx",
    description:
      "Best for editable production documents and collaborative review.",
    icon: MonitorUp,
  },
];

const pageSizeOptions: PageSizeOption[] = [
  {
    id: "A4",
    label: "A4",
    dimensions: "210 × 297 mm",
    description:
      "Recommended for international documents and printing.",
  },
  {
    id: "Letter",
    label: "Letter",
    dimensions: "8.5 × 11 in",
    description:
      "Recommended for North American documents.",
  },
];

const qualityOptions: QualityOption[] = [
  {
    id: "standard",
    label: "Standard",
    description:
      "Faster export with a smaller file size.",
    detail:
      "Ideal for previews, sharing and internal review.",
  },
  {
    id: "high",
    label: "High",
    description:
      "Maximum visual and document quality.",
    detail:
      "Ideal for final presentations and production delivery.",
  },
];

export default function ExportPanel({
  settings,
  onChange,
}: ExportPanelProps) {
  const activeFormat =
    formatOptions.find(
      (format) =>
        format.id === settings.defaultFormat
    ) ?? formatOptions[0];

  const qualityLabel =
    settings.quality === "high"
      ? "High quality"
      : "Standard quality";

  return (
    <div className="space-y-8">
      <PanelHeader
        title="Export"
        description="Configure how MuseOS packages and delivers your creative work."
      />

      <SettingsGroup
        title="Default format"
        description="Choose the format MuseOS should select when opening an export action."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {formatOptions.map((format) => {
            const Icon = format.icon;

            const selected =
              settings.defaultFormat ===
              format.id;

            return (
              <button
                key={format.id}
                type="button"
                onClick={() =>
                  onChange({
                    defaultFormat:
                      format.id,
                  })
                }
                className={`relative rounded-[22px] border p-4 text-left transition ${
                  selected
                    ? "border-violet-300/25 bg-violet-400/[0.08]"
                    : "border-white/10 bg-white/[0.025] hover:bg-white/[0.055]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                        selected
                          ? "border-violet-300/20 bg-violet-400/10 text-violet-100"
                          : "border-white/10 bg-white/5 text-white/40"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-white/80">
                        {format.label}
                      </p>

                      <p className="mt-0.5 text-xs text-white/30">
                        {format.extension}
                      </p>
                    </div>
                  </div>

                  {selected && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-300 text-black">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>

                <p className="mt-4 text-xs leading-5 text-white/30">
                  {format.description}
                </p>
              </button>
            );
          })}
        </div>

        {settings.defaultFormat !==
          "pdf" && (
          <div className="mt-4 rounded-[20px] border border-amber-300/10 bg-amber-400/[0.045] p-4">
            <p className="text-sm font-medium text-amber-100/70">
              Exporter integration pending
            </p>

            <p className="mt-1 text-xs leading-5 text-white/35">
              This preference will be saved,
              but your existing export engine
              may continue producing PDF files
              until the selected exporter is
              connected.
            </p>
          </div>
        )}
      </SettingsGroup>

      <SettingsGroup
        title="PDF page size"
        description="Choose the default document dimensions used for PDF exports."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {pageSizeOptions.map((option) => {
            const selected =
              settings.pdfPageSize ===
              option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  onChange({
                    pdfPageSize:
                      option.id,
                  })
                }
                className={`relative rounded-[22px] border p-4 text-left transition ${
                  selected
                    ? "border-violet-300/25 bg-violet-400/[0.08]"
                    : "border-white/10 bg-white/[0.025] hover:bg-white/[0.055]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white/75">
                      {option.label}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {option.dimensions}
                    </p>
                  </div>

                  {selected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-300 text-black">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs leading-5 text-white/25">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Export quality"
        description="Control the balance between output quality, export speed and file size."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {qualityOptions.map((option) => {
            const selected =
              settings.quality ===
              option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  onChange({
                    quality: option.id,
                  })
                }
                className={`relative rounded-[22px] border p-4 text-left transition ${
                  selected
                    ? "border-violet-300/25 bg-violet-400/[0.08]"
                    : "border-white/10 bg-white/[0.025] hover:bg-white/[0.055]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white/75">
                      {option.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/30">
                      {option.description}
                    </p>
                  </div>

                  {selected && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-300 text-black">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>

                <p className="mt-3 text-[11px] leading-5 text-white/20">
                  {option.detail}
                </p>
              </button>
            );
          })}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Document content"
        description="Choose which additional information is included in exported files."
      >
        <div className="space-y-3">
          <SettingsToggle
            icon={
              <Sparkles className="h-4 w-4" />
            }
            label="Include MuseOS branding"
            description="Add MuseOS identity and visual attribution to supported exports."
            checked={
              settings.includeBranding
            }
            onChange={(checked) =>
              onChange({
                includeBranding:
                  checked,
              })
            }
          />

          <SettingsToggle
            icon={
              <ShieldCheck className="h-4 w-4" />
            }
            label="Include project metadata"
            description="Include project name, export date, provider and generation details."
            checked={
              settings.includeMetadata
            }
            onChange={(checked) =>
              onChange({
                includeMetadata:
                  checked,
              })
            }
          />
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="File handling"
        description="Configure image processing and browser behaviour after export."
      >
        <div className="space-y-3">
          <SettingsToggle
            icon={
              <ImageDown className="h-4 w-4" />
            }
            label="Compress exported images"
            description="Reduce image file sizes while preserving suitable presentation quality."
            checked={
              settings.compressImages
            }
            onChange={(checked) =>
              onChange({
                compressImages:
                  checked,
              })
            }
          />

          <SettingsToggle
            icon={
              <FolderOpen className="h-4 w-4" />
            }
            label="Open file after export"
            description="Automatically open or preview the generated file when the export completes."
            checked={
              settings.openAfterExport
            }
            onChange={(checked) =>
              onChange({
                openAfterExport:
                  checked,
              })
            }
          />
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Current export profile"
        description="Summary of the settings MuseOS will use for future exports."
      >
        <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-100/75">
              <BadgeCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-white/80">
                {activeFormat.label}
              </p>

              <p className="mt-1 text-xs text-white/30">
                {qualityLabel} export profile
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatusValue
              label="Format"
              value={
                activeFormat.label
              }
            />

            <StatusValue
              label="Quality"
              value={
                settings.quality ===
                "high"
                  ? "High"
                  : "Standard"
              }
            />

            <StatusValue
              label="Page size"
              value={
                settings.pdfPageSize
              }
            />

            <StatusValue
              label="Branding"
              value={
                settings.includeBranding
                  ? "Included"
                  : "Excluded"
              }
            />

            <StatusValue
              label="Metadata"
              value={
                settings.includeMetadata
                  ? "Included"
                  : "Excluded"
              }
            />

            <StatusValue
              label="Images"
              value={
                settings.compressImages
                  ? "Compressed"
                  : "Original quality"
              }
            />

            <StatusValue
              label="After export"
              value={
                settings.openAfterExport
                  ? "Open automatically"
                  : "Remain in workspace"
              }
            />
          </div>
        </div>
      </SettingsGroup>
    </div>
  );
}

function PanelHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
        MuseOS Settings
      </p>

      <h2 className="mt-2 text-2xl font-semibold text-white/90">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
        {description}
      </p>
    </div>
  );
}

function SettingsGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white/70">
          {title}
        </h3>

        <p className="mt-1 text-xs text-white/30">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function SettingsToggle({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon?: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (
    checked: boolean
  ) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() =>
        onChange(!checked)
      }
      className="flex w-full items-center justify-between gap-5 rounded-[22px] border border-white/10 bg-white/[0.025] p-4 text-left transition hover:bg-white/[0.05]"
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40">
            {icon}
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-white/70">
            {label}
          </p>

          <p className="mt-1 text-xs leading-5 text-white/30">
            {description}
          </p>
        </div>
      </div>

      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked
            ? "bg-violet-400"
            : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function StatusValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
      <p className="text-[10px] uppercase tracking-[0.12em] text-white/20">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-white/55">
        {value}
      </p>
    </div>
  );
}