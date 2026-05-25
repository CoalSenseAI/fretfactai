import { parseChordName } from "./parser";
import { intervalsToPitchClasses } from "./notes";
import { resolveFingerings } from "./fingerings";
import type { ChordResolution } from "./types";

export function resolveChord(input: string): ChordResolution {
  const parsed = parseChordName(input);
  const notes = intervalsToPitchClasses(parsed.root, parsed.intervals);
  const fingerings = resolveFingerings(parsed);

  return {
    input,
    parsed,
    notes,
    fingerings,
  };
}

export { parseChordName } from "./parser";
export { resolveFingerings } from "./fingerings";
export {
  STANDARD_TUNING,
  intervalsToPitchClasses,
  parsePitchClass,
  pitchClassToSemitone,
  semitoneToPitchClass,
  addSemitones,
} from "./notes";
export type {
  ChordResolution,
  Fingering,
  ParsedChord,
  PitchClass,
} from "./types";
export { CHROMATIC, ChordParseError } from "./types";
