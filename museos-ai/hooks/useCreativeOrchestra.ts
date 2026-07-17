"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createOrchestra } from "@/lib/createOrchestra";
import {
  AgentActivity,
  CreativeOrchestra,
  CreativeProject,
  OrchestraStage,
} from "@/types/creative";

interface UseCreativeOrchestraOptions {
  project: CreativeProject;
  autoStart?: boolean;
  onStageChange?: (
    stage: OrchestraStage,
    visibleNodeIds: string[]
  ) => void;
  onComplete?: () => void;
}

export function useCreativeOrchestra({
  project,
  autoStart = true,
  onStageChange,
  onComplete,
}: UseCreativeOrchestraOptions) {
  const initialOrchestra = useMemo(
    () => createOrchestra(project),
    [project]
  );

  const [orchestra, setOrchestra] =
    useState<CreativeOrchestra>(initialOrchestra);

  const [visibleNodeIds, setVisibleNodeIds] = useState<string[]>([]);
  const [visibleDebateCount, setVisibleDebateCount] = useState(0);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasStartedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    hasStartedRef.current = false;
    setOrchestra(createOrchestra(project));
    setVisibleNodeIds([]);
    setVisibleDebateCount(0);
  }, [clearTimers, project]);

  const addActivity = useCallback((activity: AgentActivity) => {
    setOrchestra((current) => ({
      ...current,
      activities: [...current.activities, activity],
    }));
  }, []);

  const runStage = useCallback(
    (stageIndex: number) => {
      const currentOrchestra = createOrchestra(project);
      const stage = currentOrchestra.stages[stageIndex];

      if (!stage) {
        setOrchestra((current) => ({
          ...current,
          status: "complete",
        }));

        onComplete?.();
        return;
      }

      setOrchestra((current) => ({
        ...current,
        status: stage.type === "complete" ? "complete" : "running",
        currentStageIndex: stageIndex,
      }));

      if (stage.agentId) {
        addActivity({
          id: `${stage.id}-thinking-${Date.now()}`,
          agentId: stage.agentId,
          status: "thinking",
          message: stage.description,
          timestamp: Date.now(),
          relatedNodeIds: stage.nodeIds,
        });
      }

      const nodesToReveal = stage.nodeIds;

      if (nodesToReveal.length > 0) {
        nodesToReveal.forEach((nodeId, nodeIndex) => {
          const timer = setTimeout(() => {
            setVisibleNodeIds((current) => {
              const next = current.includes(nodeId)
                ? current
                : [...current, nodeId];

              onStageChange?.(stage, next);

              return next;
            });
          }, 250 + nodeIndex * 320);

          timersRef.current.push(timer);
        });
      } else {
        onStageChange?.(stage, visibleNodeIds);
      }

      if (stage.type === "debate") {
        currentOrchestra.debate.forEach((_, debateIndex) => {
          const timer = setTimeout(() => {
            setVisibleDebateCount(debateIndex + 1);
          }, 250 + debateIndex * 400);

          timersRef.current.push(timer);
        });
      }

      const completeAgentTimer = setTimeout(() => {
        if (stage.agentId) {
          addActivity({
            id: `${stage.id}-complete-${Date.now()}`,
            agentId: stage.agentId,
            status: "complete",
            message: `${stage.label} complete.`,
            timestamp: Date.now(),
            relatedNodeIds: stage.nodeIds,
          });
        }

        // eslint-disable-next-line react-hooks/immutability
        runStage(stageIndex + 1);
      }, stage.duration);

      timersRef.current.push(completeAgentTimer);
    },
    [
      addActivity,
      onComplete,
      onStageChange,
      project,
      visibleNodeIds,
    ]
  );

  const start = useCallback(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    setOrchestra((current) => ({
      ...current,
      status: "running",
    }));

    runStage(0);
  }, [runStage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reset();

    if (autoStart) {
      const timer = setTimeout(start, 100);
      timersRef.current.push(timer);
    }

    return clearTimers;
  }, [autoStart, clearTimers, project, reset, start]);

  const currentStage =
    orchestra.stages[orchestra.currentStageIndex] ??
    orchestra.stages[0];

  return {
    orchestra,
    currentStage,
    visibleNodeIds,
    visibleDebate: orchestra.debate.slice(0, visibleDebateCount),
    start,
    reset,
    isRunning: orchestra.status === "running",
    isComplete: orchestra.status === "complete",
  };
}