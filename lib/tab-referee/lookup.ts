import { resolveChord } from "@/lib/chords";
import type { ChordResolution } from "@/lib/chords";
import { getSongById, SONG_DATABASE } from "./songs";
import {
  TabRefereeError,
  type SongMatch,
  type TabRefereeResult,
} from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(" ").filter(Boolean);
}

function scoreSong(query: string, haystack: string[]): number {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;

  const joined = haystack.join(" ");
  if (joined === normalizedQuery) return 100;
  if (joined.includes(normalizedQuery)) return 80;
  if (normalizedQuery.includes(joined)) return 70;

  const queryTokens = tokenize(query);
  const targetTokens = new Set(haystack.flatMap((entry) => tokenize(entry)));
  let overlap = 0;

  for (const token of queryTokens) {
    if (targetTokens.has(token)) overlap += 1;
  }

  if (overlap === 0) return 0;
  return 20 + overlap * 15;
}

export function searchSongs(query: string): SongMatch[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  return SONG_DATABASE.map((song) => {
    const fields = [
      song.title,
      song.artist,
      `${song.title} ${song.artist}`,
      ...song.aliases,
    ];
    return {
      id: song.id,
      title: song.title,
      artist: song.artist,
      score: scoreSong(trimmed, fields),
    };
  })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score);
}

function uniqueChords(sections: TabRefereeResult["song"]["sections"]): string[] {
  const seen = new Set<string>();
  const chords: string[] = [];

  for (const section of sections) {
    for (const chord of section.chords) {
      if (seen.has(chord)) continue;
      seen.add(chord);
      chords.push(chord);
    }
  }

  return chords;
}

function resolveVoicings(chords: string[]): Record<string, ChordResolution> {
  const voicings: Record<string, ChordResolution> = {};

  for (const chord of chords) {
    voicings[chord] = resolveChord(chord);
  }

  return voicings;
}

export function lookupTabReferee(
  query: string,
  songId?: string,
): TabRefereeResult {
  if (songId) {
    return lookupTabRefereeById(songId);
  }

  const matches = searchSongs(query);
  if (matches.length === 0) {
    throw new TabRefereeError(
      `No match for "${query}". Try a song title like "Wonderwall" or "Hotel California".`,
    );
  }

  const ambiguous = getAmbiguousMatches(query);
  if (ambiguous.length > 1) {
    throw new TabRefereeError(
      `Multiple matches found for "${query}". Pick a song to continue.`,
    );
  }

  return lookupTabRefereeById(matches[0].id);
}

export function lookupTabRefereeById(songId: string): TabRefereeResult {
  const song = getSongById(songId);
  if (!song) {
    throw new TabRefereeError("Song not found.");
  }

  const chords = uniqueChords(song.sections);

  return {
    song,
    chords,
    voicings: resolveVoicings(chords),
  };
}

export function getAmbiguousMatches(query: string): SongMatch[] {
  const matches = searchSongs(query);
  if (matches.length <= 1) return [];

  const topScore = matches[0]?.score ?? 0;
  return matches.filter((match) => match.score >= topScore - 10);
}
