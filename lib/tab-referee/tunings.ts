import { STANDARD_TUNING, addSemitones } from "@/lib/chords";
import type { Tuning } from "./types";

function mapStrings(semitones: number): Tuning["strings"] {
  return STANDARD_TUNING.map((note) => addSemitones(note, semitones));
}

export const TUNINGS = {
  standard: {
    name: "Standard (E A D G B E)",
    strings: STANDARD_TUNING,
  },
  halfStepDown: {
    name: "Half step down (Eb Ab Db Gb Bb Eb)",
    strings: mapStrings(-1),
  },
  dropD: {
    name: "Drop D (D A D G B E)",
    strings: ["D", "A", "D", "G", "B", "E"],
  },
} as const satisfies Record<string, Tuning>;
