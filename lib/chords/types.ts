export const CHROMATIC = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type PitchClass = (typeof CHROMATIC)[number];

export interface ParsedChord {
  root: PitchClass;
  bass?: PitchClass;
  /** Semitone intervals from the root (always includes 0). */
  intervals: number[];
}

export interface Fingering {
  /** Low E → high E. `null` = muted string, `0` = open. */
  frets: (number | null)[];
  /** Fret span of the shape (for sorting). */
  span: number;
  /** Lowest fret used (barre position hint). */
  baseFret: number;
}

export interface ChordResolution {
  input: string;
  parsed: ParsedChord;
  notes: PitchClass[];
  fingerings: Fingering[];
}

export class ChordParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChordParseError";
  }
}
