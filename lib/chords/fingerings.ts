import type { Fingering, ParsedChord } from "./types";
import {
  STANDARD_TUNING,
  intervalsToPitchClasses,
  pitchClassToSemitone,
} from "./notes";

const MAX_FRET = 14;
const MAX_SPAN = 5;
const MAX_RESULTS = 12;

function fretSpan(frets: (number | null)[]): number {
  const played = frets.filter((f): f is number => f !== null);
  if (played.length === 0) return 0;
  return Math.max(...played) - Math.min(...played);
}

function baseFret(frets: (number | null)[]): number {
  const played = frets.filter((f): f is number => f !== null && f > 0);
  if (played.length === 0) return 0;
  return Math.min(...played);
}

function playedPitchClasses(frets: (number | null)[]): Set<number> {
  const tones = new Set<number>();
  for (let i = 0; i < frets.length; i++) {
    const fret = frets[i];
    if (fret === null) continue;
    const open = pitchClassToSemitone(STANDARD_TUNING[i]);
    tones.add((open + fret) % 12);
  }
  return tones;
}

function lowestPitchClass(frets: (number | null)[]): number | null {
  let lowest: number | null = null;
  for (let i = 0; i < frets.length; i++) {
    const fret = frets[i];
    if (fret === null) continue;
    const open = pitchClassToSemitone(STANDARD_TUNING[i]);
    const pitch = open + fret;
    if (lowest === null || pitch < lowest) lowest = pitch;
  }
  return lowest === null ? null : lowest % 12;
}

function scoreFingering(
  frets: (number | null)[],
  requiredTones: Set<number>,
  rootPc: number,
  bassPc?: number,
): number {
  const played = playedPitchClasses(frets);
  let score = 0;

  for (const tone of requiredTones) {
    if (!played.has(tone)) score += 100;
  }

  const lowest = lowestPitchClass(frets);
  if (lowest !== null) {
    if (bassPc !== undefined) {
      if (lowest !== bassPc) score += 40;
    } else if (lowest !== rootPc) {
      score += 15;
    }
  }

  score += fretSpan(frets) * 3;
  for (const fret of frets) {
    if (fret !== null) score += fret;
  }
  return score;
}

function fretsKey(frets: (number | null)[]): string {
  return frets.map((f) => (f === null ? "x" : String(f))).join("-");
}

function optionsForString(
  stringIndex: number,
  allowedTones: Set<number>,
): (number | null)[] {
  const open = pitchClassToSemitone(STANDARD_TUNING[stringIndex]);
  const options: (number | null)[] = [null];

  for (let fret = 0; fret <= MAX_FRET; fret++) {
    if (allowedTones.has((open + fret) % 12)) {
      options.push(fret);
    }
  }

  return options;
}

function isValidVoicing(
  frets: (number | null)[],
  requiredTones: Set<number>,
  bassPc?: number,
): boolean {
  const playedCount = frets.filter((f) => f !== null).length;
  if (playedCount < 3) return false;
  if (fretSpan(frets) > MAX_SPAN) return false;

  const played = playedPitchClasses(frets);
  for (const tone of requiredTones) {
    if (!played.has(tone)) return false;
  }

  if (bassPc !== undefined) {
    const lowest = lowestPitchClass(frets);
    if (lowest !== bassPc) return false;
  }

  return true;
}

function searchFingerings(
  stringIndex: number,
  current: (number | null)[],
  perStringOptions: (number | null)[][],
  requiredTones: Set<number>,
  rootPc: number,
  bassPc: number | undefined,
  results: Map<string, Fingering>,
): void {
  if (stringIndex === perStringOptions.length) {
    if (!isValidVoicing(current, requiredTones, bassPc)) return;

    const frets = [...current];
    const key = fretsKey(frets);
    if (results.has(key)) return;

    results.set(key, {
      frets,
      span: fretSpan(frets),
      baseFret: baseFret(frets),
    });
    return;
  }

  for (const option of perStringOptions[stringIndex]) {
    current[stringIndex] = option;

    const played = current.slice(0, stringIndex + 1).filter((f) => f !== null);
    if (played.length + (perStringOptions.length - stringIndex - 1) < 3) {
      continue;
    }

    if (fretSpan(current.slice(0, stringIndex + 1)) > MAX_SPAN) {
      continue;
    }

    searchFingerings(
      stringIndex + 1,
      current,
      perStringOptions,
      requiredTones,
      rootPc,
      bassPc,
      results,
    );
  }
}

function barreShape(
  shape: (number | null)[],
  barreFret: number,
): (number | null)[] {
  return shape.map((offset) => {
    if (offset === null) return null;
    return barreFret + offset;
  });
}

function addBarreCandidates(
  rootPc: number,
  shape: (number | null)[],
  anchorString: number,
  anchorInterval: number,
  results: Map<string, Fingering>,
): void {
  for (let barre = 1; barre <= MAX_FRET; barre++) {
    const anchorFret = barre + anchorInterval;
    if (anchorFret < 0 || anchorFret > MAX_FRET) continue;

    const open = pitchClassToSemitone(STANDARD_TUNING[anchorString]);
    if ((open + anchorFret) % 12 !== rootPc) continue;

    const frets = barreShape(shape, barre);
    if (frets.some((f) => f !== null && (f < 0 || f > MAX_FRET))) continue;

    const key = fretsKey(frets);
    results.set(key, {
      frets,
      span: fretSpan(frets),
      baseFret: baseFret(frets),
    });
  }
}

function addCommonBarreShapes(
  parsed: ParsedChord,
  results: Map<string, Fingering>,
): void {
  const rootPc = pitchClassToSemitone(parsed.root);
  const hasMinorThird = parsed.intervals.includes(3);
  const hasMajorThird = parsed.intervals.includes(4);
  const hasMinorSeventh = parsed.intervals.includes(10);
  const hasMajorSeventh = parsed.intervals.includes(11);
  const isPower = parsed.intervals.length === 2 && parsed.intervals.includes(7);

  if (isPower) {
    addBarreCandidates(rootPc, [null, null, null, null, null, 0], 5, 0, results);
    addBarreCandidates(rootPc, [0, null, null, null, null, null], 0, 0, results);
    return;
  }

  if (hasMinorThird && !hasMajorThird) {
    addBarreCandidates(rootPc, [0, 2, 2, 0, 0, 0], 0, 0, results);
    addBarreCandidates(rootPc, [null, 0, 2, 2, 1, 0], 1, 0, results);
  } else if (hasMajorThird) {
    addBarreCandidates(rootPc, [0, 2, 2, 1, 0, 0], 0, 0, results);
    addBarreCandidates(rootPc, [null, 0, 2, 2, 2, 0], 1, 0, results);
  }

  if (hasMajorSeventh) {
    addBarreCandidates(rootPc, [0, 2, 1, 1, 0, 0], 0, 0, results);
    addBarreCandidates(rootPc, [null, 0, 2, 1, 2, 0], 1, 0, results);
  } else if (hasMinorSeventh) {
    addBarreCandidates(rootPc, [0, 2, 0, 1, 0, 0], 0, 0, results);
    addBarreCandidates(rootPc, [null, 0, 2, 0, 2, 0], 1, 0, results);
  }
}

export function resolveFingerings(parsed: ParsedChord): Fingering[] {
  const notes = intervalsToPitchClasses(parsed.root, parsed.intervals);
  const requiredTones = new Set(notes.map(pitchClassToSemitone));
  const rootPc = pitchClassToSemitone(parsed.root);
  const bassPc = parsed.bass ? pitchClassToSemitone(parsed.bass) : undefined;

  const perStringOptions = STANDARD_TUNING.map((_, i) =>
    optionsForString(i, requiredTones),
  );

  const results = new Map<string, Fingering>();
  addCommonBarreShapes(parsed, results);

  searchFingerings(
    0,
    Array<number | null>(STANDARD_TUNING.length).fill(null),
    perStringOptions,
    requiredTones,
    rootPc,
    bassPc,
    results,
  );

  return [...results.values()]
    .sort(
      (a, b) =>
        scoreFingering(a.frets, requiredTones, rootPc, bassPc) -
        scoreFingering(b.frets, requiredTones, rootPc, bassPc),
    )
    .slice(0, MAX_RESULTS);
}
