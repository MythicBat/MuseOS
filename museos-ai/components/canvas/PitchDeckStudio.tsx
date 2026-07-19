"use client";

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Maximize2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  PitchDeckOutputData,
  PitchDeckSlide,
} from "@/types/creative";

interface PitchDeckStudioProps {
  deck: PitchDeckOutputData;
  onChange?: (
    nextDeck: PitchDeckOutputData
  ) => void;
}

export default function PitchDeckStudio({
  deck,
  onChange,
}: PitchDeckStudioProps) {

  const [selectedSlideId, setSelectedSlideId] =
    useState(deck.slides[0]?.id ?? "");

  const [
    editingSlideId,
    setEditingSlideId,
  ] = useState<string | null>(null);

  const [
    presentationIndex,
    setPresentationIndex,
  ] = useState<number | null>(null);


  const commitDeck = (
    nextDeck: PitchDeckOutputData
  ) => {
    onChange?.(nextDeck);
  };

  const updateSlide = (
    slideId: string,
    updates: Partial<PitchDeckSlide>
  ) => {
    commitDeck({
      ...deck,
      slides: deck.slides.map(
        (slide) =>
          slide.id === slideId
            ? {
                ...slide,
                ...updates,
              }
            : slide
      ),
    });
  };

  const duplicateSlide = (
    slideId: string
  ) => {
    const index =
      deck.slides.findIndex(
        (slide) => slide.id === slideId
      );

    if (index < 0) return;

    const original =
      deck.slides[index];

    const duplicate: PitchDeckSlide = {
      ...original,
      id: `slide-${Date.now()}`,
      title: `${original.title} Copy`,
    };

    const nextSlides = [
      ...deck.slides,
    ];

    nextSlides.splice(
      index + 1,
      0,
      duplicate
    );

    commitDeck({
      ...deck,
      slides: renumberSlides(nextSlides),
    });

    setSelectedSlideId(duplicate.id);
  };

  const deleteSlide = (
    slideId: string
  ) => {
    if (deck.slides.length <= 1) {
      return;
    }

    const index =
      deck.slides.findIndex(
        (slide) => slide.id === slideId
      );

    const nextSlides =
      deck.slides.filter(
        (slide) => slide.id !== slideId
      );

    commitDeck({
      ...deck,
      slides: renumberSlides(nextSlides),
    });

    const nextSelection =
      nextSlides[
        Math.min(
          index,
          nextSlides.length - 1
        )
      ];

    setSelectedSlideId(
      nextSelection?.id ?? ""
    );
  };

  const moveSlide = (
    slideId: string,
    direction: -1 | 1
  ) => {
    const currentIndex =
      deck.slides.findIndex(
        (slide) => slide.id === slideId
      );

    const targetIndex =
      currentIndex + direction;

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >=
        deck.slides.length
    ) {
      return;
    }

    const nextSlides = [
      ...deck.slides,
    ];

    const [movedSlide] =
      nextSlides.splice(currentIndex, 1);

    nextSlides.splice(
      targetIndex,
      0,
      movedSlide
    );

    commitDeck({
      ...deck,
      slides: renumberSlides(nextSlides),
    });
  };

  const selectedSlide =
    deck.slides.find(
      (slide) =>
        slide.id === selectedSlideId
    ) ?? deck.slides[0];

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-2">
          {deck.slides.map(
            (slide) => {
              const selected =
                slide.id ===
                selectedSlide?.id;

              return (
                <button
                  type="button"
                  key={slide.id}
                  onClick={() =>
                    setSelectedSlideId(
                      slide.id
                    )
                  }
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    selected
                      ? "border-violet-300/25 bg-violet-400/[0.1]"
                      : "border-white/10 bg-black/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                    Slide{" "}
                    {slide.slideNumber}
                  </p>

                  <p className="mt-1 truncate text-xs font-medium text-white/65">
                    {slide.title}
                  </p>
                </button>
              );
            }
          )}
        </aside>

        {selectedSlide && (
          <motion.section
            layout
            key={selectedSlide.id}
            className="overflow-hidden rounded-[28px] border border-white/10 bg-black/25"
          >
            <div className="relative aspect-video overflow-hidden border-b border-white/10 bg-[#15131f] p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.18),transparent_38%)]" />

              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-violet-200/50">
                    {
                      deck.deckTitle
                    }
                  </span>

                  <span className="text-sm text-white/20">
                    {String(
                      selectedSlide.slideNumber
                    ).padStart(2, "0")}
                  </span>
                </div>

                <div className="my-auto max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                    {selectedSlide.title}
                  </p>

                  <h5 className="mt-4 text-3xl font-semibold leading-tight text-white/90 lg:text-5xl">
                    {
                      selectedSlide.headline
                    }
                  </h5>

                  <ul className="mt-7 space-y-2">
                    {selectedSlide.supportingPoints.map(
                      (point, index) => (
                        <li
                          key={`${selectedSlide.id}-${index}`}
                          className="flex gap-3 text-sm text-white/50"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                          {point}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <p className="line-clamp-2 text-xs text-white/25">
                  {
                    selectedSlide.visualDirection
                  }
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditingSlideId(
                      selectedSlide.id
                    )
                  }
                  className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/50 hover:bg-white/10"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit slide
                </button>

                <button
                  type="button"
                  onClick={() =>
                    duplicateSlide(
                      selectedSlide.id
                    )
                  }
                  className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/50 hover:bg-white/10"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Duplicate
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteSlide(
                      selectedSlide.id
                    )
                  }
                  className="flex items-center gap-2 rounded-full border border-red-300/10 px-3 py-2 text-xs text-red-200/50 hover:bg-red-400/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    moveSlide(
                      selectedSlide.id,
                      -1
                    )
                  }
                  disabled={
                    selectedSlide.slideNumber ===
                    1
                  }
                  className="rounded-full border border-white/10 p-2 text-white/45 disabled:opacity-25"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    moveSlide(
                      selectedSlide.id,
                      1
                    )
                  }
                  disabled={
                    selectedSlide.slideNumber ===
                    deck.slides.length
                  }
                  className="rounded-full border border-white/10 p-2 text-white/45 disabled:opacity-25"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPresentationIndex(
                      selectedSlide.slideNumber -
                        1
                    )
                  }
                  className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-black"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  Present
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Speaker notes
              </p>

              <p className="mt-2 text-xs leading-6 text-white/45">
                {
                  selectedSlide.speakerNotes
                }
              </p>
            </div>
          </motion.section>
        )}
      </div>

      <AnimatePresence>
        {editingSlideId &&
          selectedSlide && (
            <SlideEditor
              slide={selectedSlide}
              onSave={(updates) => {
                updateSlide(
                  editingSlideId,
                  updates
                );

                setEditingSlideId(null);
              }}
              onClose={() =>
                setEditingSlideId(null)
              }
            />
          )}
      </AnimatePresence>

      <AnimatePresence>
        {presentationIndex !== null && (
          <PresentationMode
            deck={deck}
            index={presentationIndex}
            onIndexChange={
              setPresentationIndex
            }
            onClose={() =>
              setPresentationIndex(null)
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}

function renumberSlides(
  slides: PitchDeckSlide[]
): PitchDeckSlide[] {
  return slides.map(
    (slide, index) => ({
      ...slide,
      slideNumber: index + 1,
    })
  );
}

function SlideEditor({
  slide,
  onSave,
  onClose,
}: {
  slide: PitchDeckSlide;
  onSave: (
    updates: Partial<PitchDeckSlide>
  ) => void;
  onClose: () => void;
}) {
  const [title, setTitle] =
    useState(slide.title);

  const [headline, setHeadline] =
    useState(slide.headline);

  const [
    supportingPoints,
    setSupportingPoints,
  ] = useState([
    ...slide.supportingPoints,
  ]);

  const [
    visualDirection,
    setVisualDirection,
  ] = useState(
    slide.visualDirection
  );

  const [
    speakerNotes,
    setSpeakerNotes,
  ] = useState(slide.speakerNotes);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-xl">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
        }}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[30px] border border-white/10 bg-[#15131e] p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/35">
              Slide editor
            </p>

            <h4 className="mt-1 text-xl font-semibold text-white">
              Slide {slide.slideNumber}
            </h4>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-white/45"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <EditorField
            label="Title"
            value={title}
            onChange={setTitle}
          />

          <EditorField
            label="Headline"
            value={headline}
            onChange={setHeadline}
            multiline
          />

          <div>
            <p className="mb-2 text-xs text-white/40">
              Supporting points
            </p>

            <div className="space-y-2">
              {supportingPoints.map(
                (point, index) => (
                  <input
                    key={index}
                    value={point}
                    onChange={(event) => {
                      const next = [
                        ...supportingPoints,
                      ];

                      next[index] =
                        event.target.value;

                      setSupportingPoints(
                        next
                      );
                    }}
                    className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none"
                  />
                )
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setSupportingPoints(
                  (current) => [
                    ...current,
                    "",
                  ]
                )
              }
              className="mt-2 flex items-center gap-1.5 text-xs text-violet-200/60"
            >
              <Plus className="h-3 w-3" />
              Add point
            </button>
          </div>

          <EditorField
            label="Visual direction"
            value={visualDirection}
            onChange={
              setVisualDirection
            }
            multiline
          />

          <EditorField
            label="Speaker notes"
            value={speakerNotes}
            onChange={setSpeakerNotes}
            multiline
          />
        </div>

        <button
          type="button"
          onClick={() =>
            onSave({
              title,
              headline,
              supportingPoints:
                supportingPoints.filter(
                  Boolean
                ),
              visualDirection,
              speakerNotes,
            })
          }
          className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
        >
          Save changes
        </button>
      </motion.div>
    </div>
  );
}

function EditorField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-white/40">
        {label}
      </span>

      {multiline ? (
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          rows={4}
          className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none"
        />
      ) : (
        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none"
        />
      )}
    </label>
  );
}

function PresentationMode({
  deck,
  index,
  onIndexChange,
  onClose,
}: {
  deck: PitchDeckOutputData;
  index: number;
  onIndexChange: (
    index: number
  ) => void;
  onClose: () => void;
}) {
  const slide = deck.slides[index];

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        onIndexChange(
          Math.min(
            index + 1,
            deck.slides.length - 1
          )
        );
      }

      if (event.key === "ArrowLeft") {
        onIndexChange(
          Math.max(index - 1, 0)
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    deck.slides.length,
    index,
    onClose,
    onIndexChange,
  ]);

  if (!slide) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0b0a10] p-6"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-3 text-white/60"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() =>
          onIndexChange(
            Math.max(index - 1, 0)
          )
        }
        disabled={index === 0}
        className="absolute left-6 rounded-full border border-white/10 bg-white/5 p-3 text-white/60 disabled:opacity-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div className="flex aspect-video w-full max-w-6xl flex-col rounded-[32px] border border-white/10 bg-[#15131f] p-12 shadow-2xl">
        <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-white/30">
          <span>{deck.deckTitle}</span>

          <span>
            {slide.slideNumber} /{" "}
            {deck.slides.length}
          </span>
        </div>

        <div className="my-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[0.22em] text-violet-200/50">
            {slide.title}
          </p>

          <h2 className="mt-6 text-5xl font-semibold leading-tight text-white lg:text-7xl">
            {slide.headline}
          </h2>

          <ul className="mt-10 space-y-4">
            {slide.supportingPoints.map(
              (point, pointIndex) => (
                <li
                  key={pointIndex}
                  className="flex gap-4 text-lg text-white/55"
                >
                  <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-violet-300" />

                  {point}
                </li>
              )
            )}
          </ul>
        </div>

        <p className="text-sm text-white/25">
          {slide.visualDirection}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          onIndexChange(
            Math.min(
              index + 1,
              deck.slides.length - 1
            )
          )
        }
        disabled={
          index ===
          deck.slides.length - 1
        }
        className="absolute right-6 rounded-full border border-white/10 bg-white/5 p-3 text-white/60 disabled:opacity-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </motion.div>
  );
}