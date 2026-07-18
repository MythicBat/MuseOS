import {
  CanvasNode,
  CreativeVersion,
  CreativeVersionComparison,
  DNA,
  DNADifference,
} from "@/types/creative";

const dnaFields: Array<keyof DNA> = [
  "genre",
  "tone",
  "audience",
  "mood",
  "colors",
];

function areValuesEqual(
  first: string | string[],
  second: string | string[]
) {
  if (Array.isArray(first) && Array.isArray(second)) {
    return (
      first.length === second.length &&
      first.every((value, index) => value === second[index])
    );
  }

  return first === second;
}

function nodesAreEqual(
  first: CanvasNode,
  second: CanvasNode
) {
  return (
    first.title === second.title &&
    first.subtitle === second.subtitle &&
    first.type === second.type &&
    first.x === second.x &&
    first.y === second.y
  );
}

export function compareCreativeVersions(
  fromVersion: CreativeVersion,
  toVersion: CreativeVersion
): CreativeVersionComparison {
  const dnaDifferences: DNADifference[] = dnaFields
    .filter(
      (field) =>
        !areValuesEqual(
          fromVersion.project.dna[field],
          toVersion.project.dna[field]
        )
    )
    .map((field) => ({
      field,
      before: fromVersion.project.dna[field],
      after: toVersion.project.dna[field],
    }));

  const fromNodes = new Map(
    fromVersion.project.nodes.map((node) => [
      node.id,
      node,
    ])
  );

  const toNodes = new Map(
    toVersion.project.nodes.map((node) => [
      node.id,
      node,
    ])
  );

  const addedNodes = toVersion.project.nodes.filter(
    (node) => !fromNodes.has(node.id)
  );

  const removedNodes = fromVersion.project.nodes.filter(
    (node) => !toNodes.has(node.id)
  );

  const changedNodes = toVersion.project.nodes
    .map((afterNode) => {
      const beforeNode = fromNodes.get(afterNode.id);

      if (
        !beforeNode ||
        nodesAreEqual(beforeNode, afterNode)
      ) {
        return null;
      }

      return {
        before: beforeNode,
        after: afterNode,
      };
    })
    .filter(
      (
        item
      ): item is {
        before: CanvasNode;
        after: CanvasNode;
      } => item !== null
    );

  return {
    fromVersion,
    toVersion,
    dnaDifferences,
    addedNodes,
    removedNodes,
    changedNodes,
  };
}