export type DiffSegment = {
  value: string;
  type: "same" | "add" | "remove";
};

export type DiffRow = {
  type: "same" | "add" | "remove" | "change";
  left?: string;
  right?: string;
  leftSegments?: DiffSegment[];
  rightSegments?: DiffSegment[];
};

type RawDiff<T> =
  | { type: "same"; left: T; right: T }
  | { type: "remove"; left: T }
  | { type: "add"; right: T };

function diffSequence<T>(left: T[], right: T[], isEqual: (a: T, b: T) => boolean = (a, b) => a === b) {
  const dp = Array.from({ length: left.length + 1 }, () => Array<number>(right.length + 1).fill(0));

  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      dp[i][j] = isEqual(left[i], right[j])
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: RawDiff<T>[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (isEqual(left[i], right[j])) {
      result.push({ type: "same", left: left[i], right: right[j] });
      i += 1;
      j += 1;
      continue;
    }

    if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: "remove", left: left[i] });
      i += 1;
    } else {
      result.push({ type: "add", right: right[j] });
      j += 1;
    }
  }

  while (i < left.length) {
    result.push({ type: "remove", left: left[i] });
    i += 1;
  }

  while (j < right.length) {
    result.push({ type: "add", right: right[j] });
    j += 1;
  }

  return result;
}

function mergeSegments(segments: DiffSegment[]) {
  return segments.reduce<DiffSegment[]>((merged, segment) => {
    const previous = merged[merged.length - 1];

    if (previous && previous.type === segment.type) {
      previous.value += segment.value;
      return merged;
    }

    merged.push({ ...segment });
    return merged;
  }, []);
}

function diffInline(left: string, right: string) {
  const leftTokens = left.match(/\s+|[^\s]+/g) ?? [];
  const rightTokens = right.match(/\s+|[^\s]+/g) ?? [];
  const operations = diffSequence(leftTokens, rightTokens);
  const leftSegments: DiffSegment[] = [];
  const rightSegments: DiffSegment[] = [];

  operations.forEach((operation) => {
    if (operation.type === "same") {
      leftSegments.push({ type: "same", value: operation.left });
      rightSegments.push({ type: "same", value: operation.right });
      return;
    }

    if (operation.type === "remove") {
      leftSegments.push({ type: "remove", value: operation.left });
      return;
    }

    rightSegments.push({ type: "add", value: operation.right });
  });

  return {
    leftSegments: mergeSegments(leftSegments),
    rightSegments: mergeSegments(rightSegments),
  };
}

function buildRows(leftLines: string[], rightLines: string[]) {
  const operations = diffSequence(leftLines, rightLines);
  const rows: DiffRow[] = [];

  for (let index = 0; index < operations.length; index += 1) {
    const operation = operations[index];

    if (operation.type === "same") {
      rows.push({ type: "same", left: operation.left, right: operation.right });
      continue;
    }

    const removed: string[] = [];
    const added: string[] = [];

    while (index < operations.length && operations[index]?.type !== "same") {
      const current = operations[index];
      if (current.type === "remove") {
        removed.push(current.left);
      } else if (current.type === "add") {
        added.push(current.right);
      }
      index += 1;
    }

    index -= 1;

    const pairCount = Math.max(removed.length, added.length);
    for (let pairIndex = 0; pairIndex < pairCount; pairIndex += 1) {
      const left = removed[pairIndex];
      const right = added[pairIndex];

      if (left !== undefined && right !== undefined) {
        rows.push({
          type: "change",
          left,
          right,
          ...diffInline(left, right),
        });
      } else if (left !== undefined) {
        rows.push({ type: "remove", left });
      } else if (right !== undefined) {
        rows.push({ type: "add", right });
      }
    }
  }

  return rows;
}

export function compareText(left: string, right: string) {
  const leftLines = left.split(/\r?\n/);
  const rightLines = right.split(/\r?\n/);
  const rows = buildRows(leftLines, rightLines);
  const wordsLeft = left.match(/\b[\p{L}\p{N}'-]+\b/gu) ?? [];
  const wordsRight = right.match(/\b[\p{L}\p{N}'-]+\b/gu) ?? [];
  const wordOps = diffSequence(wordsLeft, wordsRight);
  const wordsRemoved = wordOps.filter((item) => item.type === "remove").length;
  const wordsAdded = wordOps.filter((item) => item.type === "add").length;

  return {
    rows,
    linesAdded: rows.filter((row) => row.type === "add").length,
    linesRemoved: rows.filter((row) => row.type === "remove").length,
    linesChanged: rows.filter((row) => row.type === "change").length,
    unchangedLines: rows.filter((row) => row.type === "same").length,
    wordsAdded,
    wordsRemoved,
  };
}
