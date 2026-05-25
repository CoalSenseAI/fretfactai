import { CHROMATIC, ChordParseError, type PitchClass } from "./types";

export const STANDARD_TUNING: PitchClass[] = ["E", "A", "D", "G", "B", "E"];

const FLAT_TO_SHARP: Record<string, PitchClass> = {
  Cb: "B",
  Db: "C#",
  Eb: "D#",
  Fb: "E",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

export function parsePitchClass(raw: string): PitchClass {
  const letter = raw[0]?.toUpperCase();
  if (!letter || letter < "A" || letter > "G") {
    throw new ChordParseError(`Invalid note: "${raw}"`);
  }

  const accidental = raw.slice(1);
  if (accidental === "bb") {
    throw new ChordParseError(`Invalid note: "${raw}"`);
  }

  if (accidental === "b" || accidental === "♭") {
    const flat = `${letter}b` as keyof typeof FLAT_TO_SHARP;
    const mapped = FLAT_TO_SHARP[flat];
    if (mapped) return mapped;
    throw new ChordParseError(`Invalid note: "${raw}"`);
  }

  if (accidental === "#" || accidental === "♯") {
    const sharp = `${letter}#` as PitchClass;
    if (CHROMATIC.includes(sharp)) return sharp;
    throw new ChordParseError(`Invalid note: "${raw}"`);
  }

  if (accidental !== "") {
    throw new ChordParseError(`Invalid note: "${raw}"`);
  }

  return letter as PitchClass;
}

export function pitchClassToSemitone(note: PitchClass): number {
  return CHROMATIC.indexOf(note);
}

export function semitoneToPitchClass(semitone: number): PitchClass {
  return CHROMATIC[((semitone % 12) + 12) % 12];
}

export function addSemitones(note: PitchClass, semitones: number): PitchClass {
  return semitoneToPitchClass(pitchClassToSemitone(note) + semitones);
}

export function intervalsToPitchClasses(
  root: PitchClass,
  intervals: number[],
): PitchClass[] {
  const seen = new Set<number>();
  const notes: PitchClass[] = [];

  for (const interval of intervals) {
    const semitone = pitchClassToSemitone(root) + interval;
    const pc = semitone % 12;
    if (seen.has(pc)) continue;
    seen.add(pc);
    notes.push(semitoneToPitchClass(semitone));
  }

  return notes;
}
