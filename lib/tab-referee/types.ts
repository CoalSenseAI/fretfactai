import type { PitchClass } from "@/lib/chords";
import type { ChordResolution } from "@/lib/chords";

export interface Tuning {
  name: string;
  strings: PitchClass[];
}

export interface SongSection {
  name: string;
  /** Chord symbols in order. Repeat markers like "×4" are plain text in name. */
  chords: string[];
}

export interface SongTab {
  id: string;
  title: string;
  artist: string;
  year?: number;
  aliases: string[];
  tuning: Tuning;
  capo?: number;
  key?: string;
  sections: SongSection[];
  /** Short note on accuracy / recording source. */
  verdict: string;
}

export interface SongMatch {
  id: string;
  title: string;
  artist: string;
  score: number;
}

export interface TabRefereeResult {
  song: SongTab;
  /** Unique chord symbols used in the song. */
  chords: string[];
  /** Top voicing per chord from the chord engine. */
  voicings: Record<string, ChordResolution>;
}

export class TabRefereeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TabRefereeError";
  }
}
