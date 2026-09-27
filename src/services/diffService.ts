export interface DiffSegment {
  value: string;
  added?: boolean;
  removed?: boolean;
}

/**
 * Computes word-level diff between two text strings
 */
export function computeWordDiff(oldText: string, newText: string): DiffSegment[] {
  const oldWords = oldText.split(/(\s+)/);
  const newWords = newText.split(/(\s+)/);

  const diff: DiffSegment[] = [];
  let i = 0;
  let j = 0;

  while (i < oldWords.length || j < newWords.length) {
    if (i < oldWords.length && j < newWords.length && oldWords[i] === newWords[j]) {
      diff.push({ value: oldWords[i] });
      i++;
      j++;
    } else if (j < newWords.length && (i >= oldWords.length || !oldWords.slice(i).includes(newWords[j]))) {
      diff.push({ value: newWords[j], added: true });
      j++;
    } else if (i < oldWords.length && (j >= newWords.length || !newWords.slice(j).includes(oldWords[i]))) {
      diff.push({ value: oldWords[i], removed: true });
      i++;
    } else {
      if (i < oldWords.length) {
        diff.push({ value: oldWords[i], removed: true });
        i++;
      }
      if (j < newWords.length) {
        diff.push({ value: newWords[j], added: true });
        j++;
      }
    }
  }

  // Group adjacent diffs of the same type
  const grouped: DiffSegment[] = [];
  for (const item of diff) {
    const last = grouped[grouped.length - 1];
    if (last && Boolean(last.added) === Boolean(item.added) && Boolean(last.removed) === Boolean(item.removed)) {
      last.value += item.value;
    } else {
      grouped.push({ ...item });
    }
  }

  return grouped;
}

export interface LineDiff {
  type: 'added' | 'removed' | 'unchanged';
  line: string;
  lineNumberOld?: number;
  lineNumberNew?: number;
}

/**
 * Computes line-by-line diff between two multi-line markdown documents
 */
export function computeLineDiff(oldDoc: string, newDoc: string): LineDiff[] {
  const oldLines = oldDoc.split('\n');
  const newLines = newDoc.split('\n');
  const result: LineDiff[] = [];

  let oldIdx = 0;
  let newIdx = 0;

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    if (oldIdx < oldLines.length && newIdx < newLines.length && oldLines[oldIdx] === newLines[newIdx]) {
      result.push({
        type: 'unchanged',
        line: oldLines[oldIdx],
        lineNumberOld: oldIdx + 1,
        lineNumberNew: newIdx + 1,
      });
      oldIdx++;
      newIdx++;
    } else {
      if (oldIdx < oldLines.length && !newLines.slice(newIdx, newIdx + 3).includes(oldLines[oldIdx])) {
        result.push({
          type: 'removed',
          line: oldLines[oldIdx],
          lineNumberOld: oldIdx + 1,
        });
        oldIdx++;
      } else if (newIdx < newLines.length) {
        result.push({
          type: 'added',
          line: newLines[newIdx],
          lineNumberNew: newIdx + 1,
        });
        newIdx++;
      } else if (oldIdx < oldLines.length) {
        result.push({
          type: 'removed',
          line: oldLines[oldIdx],
          lineNumberOld: oldIdx + 1,
        });
        oldIdx++;
      }
    }
  }

  return result;
}
