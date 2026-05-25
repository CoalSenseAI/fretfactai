import { ChordParseError, type ParsedChord } from "./types";
import { parsePitchClass } from "./notes";

function normalize(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, "")
    .replace(/♯/g, "#")
    .replace(/♭/g, "b");
}

interface SuffixRule {
  pattern: RegExp;
  intervals: number[];
}

/**
 * Longest-match suffix rules. First match wins.
 * Intervals are semitones from the root and always include 0.
 */
const SUFFIX_RULES: SuffixRule[] = [
  { pattern: /^maj7(?:\/|$)/i, intervals: [0, 4, 7, 11] },
  { pattern: /^major7(?:\/|$)/i, intervals: [0, 4, 7, 11] },
  { pattern: /^M7(?:\/|$)/, intervals: [0, 4, 7, 11] },
  { pattern: /^ma7(?:\/|$)/i, intervals: [0, 4, 7, 11] },
  { pattern: /^Δ7(?:\/|$)/, intervals: [0, 4, 7, 11] },

  { pattern: /^m7b5(?:\/|$)/i, intervals: [0, 3, 6, 10] },
  { pattern: /^min7b5(?:\/|$)/i, intervals: [0, 3, 6, 10] },
  { pattern: /^-7b5(?:\/|$)/, intervals: [0, 3, 6, 10] },
  { pattern: /^ø7(?:\/|$)/, intervals: [0, 3, 6, 10] },
  { pattern: /^ø(?:\/|$)/, intervals: [0, 3, 6, 10] },

  { pattern: /^mM7(?:\/|$)/i, intervals: [0, 3, 7, 11] },
  { pattern: /^minM7(?:\/|$)/i, intervals: [0, 3, 7, 11] },
  { pattern: /^mmaj7(?:\/|$)/i, intervals: [0, 3, 7, 11] },

  { pattern: /^dim7(?:\/|$)/i, intervals: [0, 3, 6, 9] },
  { pattern: /^°7(?:\/|$)/, intervals: [0, 3, 6, 9] },

  { pattern: /^m7(?:\/|$)/i, intervals: [0, 3, 7, 10] },
  { pattern: /^min7(?:\/|$)/i, intervals: [0, 3, 7, 10] },
  { pattern: /^-7(?:\/|$)/, intervals: [0, 3, 7, 10] },

  { pattern: /^maj9(?:\/|$)/i, intervals: [0, 4, 7, 11, 14] },
  { pattern: /^M9(?:\/|$)/, intervals: [0, 4, 7, 11, 14] },

  { pattern: /^m9(?:\/|$)/i, intervals: [0, 3, 7, 10, 14] },
  { pattern: /^min9(?:\/|$)/i, intervals: [0, 3, 7, 10, 14] },
  { pattern: /^-9(?:\/|$)/, intervals: [0, 3, 7, 10, 14] },

  { pattern: /^9(?:\/|$)/, intervals: [0, 4, 7, 10, 14] },

  { pattern: /^maj6(?:\/|$)/i, intervals: [0, 4, 7, 9] },
  { pattern: /^M6(?:\/|$)/, intervals: [0, 4, 7, 9] },

  { pattern: /^m6(?:\/|$)/i, intervals: [0, 3, 7, 9] },
  { pattern: /^min6(?:\/|$)/i, intervals: [0, 3, 7, 9] },
  { pattern: /^-6(?:\/|$)/, intervals: [0, 3, 7, 9] },

  { pattern: /^6(?:\/|$)/, intervals: [0, 4, 7, 9] },

  { pattern: /^add9(?:\/|$)/i, intervals: [0, 4, 7, 14] },
  { pattern: /^add2(?:\/|$)/i, intervals: [0, 2, 4, 7] },
  { pattern: /^add4(?:\/|$)/i, intervals: [0, 4, 5, 7] },

  { pattern: /^7sus4(?:\/|$)/i, intervals: [0, 5, 7, 10] },
  { pattern: /^7sus2(?:\/|$)/i, intervals: [0, 2, 7, 10] },

  { pattern: /^7(?:\/|$)/, intervals: [0, 4, 7, 10] },

  { pattern: /^maj(?:\/|$)/i, intervals: [0, 4, 7] },
  { pattern: /^major(?:\/|$)/i, intervals: [0, 4, 7] },
  { pattern: /^M(?:\/|$)/, intervals: [0, 4, 7] },

  { pattern: /^min(?:\/|$)/i, intervals: [0, 3, 7] },
  { pattern: /^minor(?:\/|$)/i, intervals: [0, 3, 7] },
  { pattern: /^m(?:\/|$)/i, intervals: [0, 3, 7] },
  { pattern: /^-(?:\/|$)/, intervals: [0, 3, 7] },

  { pattern: /^dim(?:\/|$)/i, intervals: [0, 3, 6] },
  { pattern: /^°(?:\/|$)/, intervals: [0, 3, 6] },

  { pattern: /^aug(?:\/|$)/i, intervals: [0, 4, 8] },
  { pattern: /^\+(?:\/|$)/, intervals: [0, 4, 8] },

  { pattern: /^sus2(?:\/|$)/i, intervals: [0, 2, 7] },
  { pattern: /^sus4(?:\/|$)/i, intervals: [0, 5, 7] },
  { pattern: /^sus(?:\/|$)/i, intervals: [0, 5, 7] },

  { pattern: /^5(?:\/|$)/, intervals: [0, 7] },

  { pattern: /^$/, intervals: [0, 4, 7] },
];

function parseSuffix(suffix: string): number[] {
  for (const rule of SUFFIX_RULES) {
    if (rule.pattern.test(suffix)) {
      return rule.intervals;
    }
  }

  throw new ChordParseError(`Unknown chord suffix: "${suffix || "(empty)"}"`);
}

function parseRootAndSuffix(symbol: string): { root: ParsedChord["root"]; suffix: string } {
  const match = symbol.match(/^([A-Ga-g])([#b♯♭]?)(.*)$/);
  if (!match) {
    throw new ChordParseError(`Invalid chord symbol: "${symbol}"`);
  }

  const root = parsePitchClass(match[1] + (match[2] || ""));
  return { root, suffix: match[3] ?? "" };
}

export function parseChordName(input: string): ParsedChord {
  const normalized = normalize(input);
  if (!normalized) {
    throw new ChordParseError("Chord name cannot be empty");
  }

  const [main, bassRaw] = normalized.split("/");
  const { root, suffix } = parseRootAndSuffix(main);
  const intervals = parseSuffix(suffix);

  const parsed: ParsedChord = { root, intervals };

  if (bassRaw) {
    parsed.bass = parsePitchClass(bassRaw);
  }

  return parsed;
}
