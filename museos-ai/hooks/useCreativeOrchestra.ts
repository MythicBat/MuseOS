"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
  const [orchestra, setOrchestra] =
    useState<CreativeOrchestra>(() =>
      createOrchestra(project)
    );

  const [
    visibleNodeIds,
    setVisibleNodeIds,
  ] = useState<string[]>([]);

  const [
    visibleDebateCount,
    setVisibleDebateCount,
  ] = useState(0);

  const timersRef = useRef<number[]>([]);

  const hasStartedRef = useRef(false);

  const visibleNodeIdsRef =
    useRef<string[]>([]);

  const onStageChangeRef =
    useRef(onStageChange);

  const onCompleteRef =
    useRef(onComplete);

  /*
   * Keep callback refs current without
   * restarting the orchestra.
   */

  useEffect(() => {
    onStageChangeRef.current =
      onStageChange;
  }, [onStageChange]);

  useEffect(() => {
    onCompleteRef.current =
      onComplete;
  }, [onComplete]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(
      (timer) => window.clearTimeout(timer)
    );

    timersRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();

    hasStartedRef.current = false;
    visibleNodeIdsRef.current = [];

    setOrchestra(
      createOrchestra(project)
    );

    setVisibleNodeIds([]);
    setVisibleDebateCount(0);
  }, [clearTimers, project]);

  const addActivity = useCallback(
    (activity: AgentActivity) => {
      setOrchestra((current) => ({
        ...current,
        activities: [
          ...current.activities,
          activity,
        ],
      }));
    },
    []
  );

  const runStage = useCallback(
    (stageIndex: number) => {
      const currentOrchestra =
        createOrchestra(project);

      const stage =
        currentOrchestra.stages[
          stageIndex
        ];

      if (!stage) {
        setOrchestra((current) => ({
          ...current,
          status: "complete",
        }));

        onCompleteRef.current?.();
        return;
      }

      setOrchestra((current) => ({
        ...current,
        status:
          stage.type === "complete"
            ? "complete"
            : "running",
        currentStageIndex: stageIndex,
      }));

      if (stage.agentId) {
        addActivity({
          id: `${stage.id}-thinking-${Date.now()}`,
          agentId: stage.agentId,
          status: "thinking",
          message: stage.description,
          timestamp: Date.now(),
          relatedNodeIds:
            stage.nodeIds,
        });
      }

      if (stage.nodeIds.length > 0) {
        stage.nodeIds.forEach(
          (nodeId, nodeIndex) => {
            const timer =
              window.setTimeout(() => {
                setVisibleNodeIds(
                  (current) => {
                    const next =
                      current.includes(
                        nodeId
                      )
                        ? current
                        : [
                            ...current,
                            nodeId,
                          ];

                    visibleNodeIdsRef.current =
                      next;

                    onStageChangeRef.current?.(
                      stage,
                      next
                    );

                    return next;
                  }
                );
              }, 250 + nodeIndex * 320);

            timersRef.current.push(
              timer
            );
          }
        );
      } else {
        onStageChangeRef.current?.(
          stage,
          visibleNodeIdsRef.current
        );
      }

      if (stage.type === "debate") {
        currentOrchestra.debate.forEach(
          (_, debateIndex) => {
            const timer =
              window.setTimeout(() => {
                setVisibleDebateCount(
                  debateIndex + 1
                );
              }, 250 + debateIndex * 400);

            timersRef.current.push(
              timer
            );
          }
        );
      }

      const completeAgentTimer =
        window.setTimeout(() => {
          if (stage.agentId) {
            addActivity({
              id: `${stage.id}-complete-${Date.now()}`,
              agentId: stage.agentId,
              status: "complete",
              message: `${stage.label} complete.`,
              timestamp: Date.now(),
              relatedNodeIds:
                stage.nodeIds,
            });
          }

          runStage(stageIndex + 1);
        }, stage.duration);

      timersRef.current.push(
        completeAgentTimer
      );
    },
    [addActivity, project]
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
    clearTimers();

    hasStartedRef.current = false;
    visibleNodeIdsRef.current = [];

    setOrchestra(
      createOrchestra(project)
    );

    setVisibleNodeIds([]);
    setVisibleDebateCount(0);

    if (autoStart) {
      const timer =
        window.setTimeout(() => {
          start();
        }, 100);

      timersRef.current.push(timer);
    }

    return clearTimers;
  }, [
    autoStart,
    clearTimers,
    project,
    start,
  ]);

  const currentStage =
    orchestra.stages[
      orchestra.currentStageIndex
    ] ?? orchestra.stages[0];

  return {
    orchestra,
    currentStage,
    visibleNodeIds,

    visibleDebate:
      orchestra.debate.slice(
        0,
        visibleDebateCount
      ),

    start,
    reset,

    isRunning:
      orchestra.status === "running",

    isComplete:
      orchestra.status ===
      "complete",
  };
}