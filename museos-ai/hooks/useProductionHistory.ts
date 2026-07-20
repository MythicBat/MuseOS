"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  GeneratedProductionOutput,
} from "@/types/creative";

interface StoredProductionHistory {
  outputs: GeneratedProductionOutput[];
  activeOutputId: string | null;
}

interface UseProductionHistoryOptions {
  storageKey: string;
}

function createEmptyHistory(): StoredProductionHistory {
  return {
    outputs: [],
    activeOutputId: null,
  };
}

function isGeneratedOutput(
  value: unknown
): value is GeneratedProductionOutput {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const output =
    value as Partial<GeneratedProductionOutput>;

  return Boolean(
    typeof output.id === "string" &&
      typeof output.type === "string" &&
      typeof output.title === "string" &&
      typeof output.content === "string" &&
      typeof output.generatedAt === "number" &&
      typeof output.projectTitle === "string" &&
      (
        output.provider === "watsonx" ||
        output.provider === "fallback"
      )
  );
}

function readStoredHistory(
  storageKey: string
): StoredProductionHistory {
  if (typeof window === "undefined") {
    return createEmptyHistory();
  }

  try {
    const stored =
      window.localStorage.getItem(storageKey);

    if (!stored) {
      return createEmptyHistory();
    }

    const parsed =
      JSON.parse(stored) as Partial<StoredProductionHistory>;

    const outputs = Array.isArray(parsed.outputs)
      ? parsed.outputs.filter(isGeneratedOutput)
      : [];

    const activeOutputId =
      typeof parsed.activeOutputId === "string" &&
      outputs.some(
        (output) =>
          output.id === parsed.activeOutputId
      )
        ? parsed.activeOutputId
        : outputs[0]?.id ?? null;

    return {
      outputs,
      activeOutputId,
    };
  } catch (error) {
    console.error(
      "Unable to read MuseOS production history:",
      error
    );

    return createEmptyHistory();
  }
}

export function useProductionHistory({
  storageKey,
}: UseProductionHistoryOptions) {
  const [history, setHistory] =
    useState<StoredProductionHistory>(
      createEmptyHistory
    );

  const [hasHydrated, setHasHydrated] =
    useState(false);

  /*
   * Queueing hydration prevents React 19's
   * synchronous setState-within-effect warning.
   */
  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      setHistory(
        readStoredHistory(storageKey)
      );

      setHasHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  useEffect(() => {
    if (
      !hasHydrated ||
      typeof window === "undefined"
    ) {
      return;
    }

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(history)
      );
    } catch (error) {
      console.error(
        "Unable to save MuseOS production history:",
        error
      );
    }
  }, [
    hasHydrated,
    history,
    storageKey,
  ]);

  const activeOutput = useMemo(
    () =>
      history.outputs.find(
        (output) =>
          output.id ===
          history.activeOutputId
      ) ?? null,
    [
      history.activeOutputId,
      history.outputs,
    ]
  );

  const setActiveOutputId = useCallback(
    (outputId: string | null) => {
      setHistory((current) => ({
        ...current,
        activeOutputId: outputId,
      }));
    },
    []
  );

  const saveOutput = useCallback(
    (output: GeneratedProductionOutput) => {
      setHistory((current) => ({
        outputs: [
          output,
          ...current.outputs.filter(
            (item) =>
              item.id !== output.id
          ),
        ],
        activeOutputId: output.id,
      }));
    },
    []
  );

  const updateOutput = useCallback(
    (
      outputId: string,
      updates:
        | Partial<GeneratedProductionOutput>
        | ((
            output: GeneratedProductionOutput
          ) => Partial<GeneratedProductionOutput>)
    ) => {
      setHistory((current) => ({
        ...current,
        outputs: current.outputs.map(
          (output) => {
            if (output.id !== outputId) {
              return output;
            }

            const resolvedUpdates =
              typeof updates === "function"
                ? updates(output)
                : updates;

            return {
              ...output,
              ...resolvedUpdates,
            };
          }
        ),
      }));
    },
    []
  );

  const renameOutput = useCallback(
    (
      outputId: string,
      title: string
    ) => {
      const normalizedTitle =
        title.trim();

      if (!normalizedTitle) return;

      updateOutput(outputId, {
        title: normalizedTitle,
      });
    },
    [updateOutput]
  );

  const duplicateOutput = useCallback(
    (outputId: string) => {
      setHistory((current) => {
        const source =
          current.outputs.find(
            (output) =>
              output.id === outputId
          );

        if (!source) {
          return current;
        }

        const duplicate: GeneratedProductionOutput =
          {
            ...source,
            id: `output-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}`,
            title: `${source.title} Copy`,
            generatedAt: Date.now(),
          };

        return {
          outputs: [
            duplicate,
            ...current.outputs,
          ],
          activeOutputId: duplicate.id,
        };
      });
    },
    []
  );

  const deleteOutput = useCallback(
    (outputId: string) => {
      setHistory((current) => {
        const outputIndex =
          current.outputs.findIndex(
            (output) =>
              output.id === outputId
          );

        if (outputIndex < 0) {
          return current;
        }

        const nextOutputs =
          current.outputs.filter(
            (output) =>
              output.id !== outputId
          );

        let nextActiveOutputId =
          current.activeOutputId;

        if (
          current.activeOutputId ===
          outputId
        ) {
          nextActiveOutputId =
            nextOutputs[
              Math.min(
                outputIndex,
                nextOutputs.length - 1
              )
            ]?.id ?? null;
        }

        return {
          outputs: nextOutputs,
          activeOutputId:
            nextActiveOutputId,
        };
      });
    },
    []
  );

  const clearOutputs =
    useCallback(() => {
      setHistory(createEmptyHistory());
    }, []);

  return {
    outputs: history.outputs,
    activeOutput,
    activeOutputId:
      history.activeOutputId,
    hasHydrated,

    setActiveOutputId,
    saveOutput,
    updateOutput,
    renameOutput,
    duplicateOutput,
    deleteOutput,
    clearOutputs,
  };
}