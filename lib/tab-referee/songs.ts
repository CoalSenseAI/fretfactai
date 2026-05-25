import type { SongTab } from "./types";
import { TUNINGS } from "./tunings";

export const SONG_DATABASE: SongTab[] = [
  {
    id: "wonderwall-oasis",
    title: "Wonderwall",
    artist: "Oasis",
    year: 1995,
    aliases: ["wonderwall", "oasis wonderwall", "wonder wall"],
    tuning: TUNINGS.standard,
    capo: 2,
    key: "F#m (sounds with capo 2)",
    verdict:
      "Studio recording uses standard tuning with a capo on fret 2. Verse and chorus follow the same four-chord loop.",
    sections: [
      {
        name: "Verse / Chorus (× throughout)",
        chords: ["Em7", "G", "Dsus4", "A7sus4"],
      },
    ],
  },
  {
    id: "sweet-child-gnr",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    year: 1987,
    aliases: [
      "sweet child o mine",
      "sweet child",
      "gnr sweet child",
      "guns n roses sweet child",
    ],
    tuning: TUNINGS.halfStepDown,
    key: "D",
    verdict:
      "Album version is tuned a half step down. Main rhythm section cycles D–C–G while the intro lead uses the famous open-string pattern in this tuning.",
    sections: [
      {
        name: "Main progression",
        chords: ["D", "C", "G"],
      },
    ],
  },
  {
    id: "hotel-california-eagles",
    title: "Hotel California",
    artist: "Eagles",
    year: 1976,
    aliases: ["hotel california", "eagles hotel california", "hotel cali"],
    tuning: TUNINGS.standard,
    key: "B minor",
    verdict:
      "Studio take is standard tuning with no capo on the rhythm guitar. Progression below matches the well-known album arrangement.",
    sections: [
      {
        name: "Progression",
        chords: ["Am", "E", "G", "D", "F", "C", "Dm", "E"],
      },
    ],
  },
  {
    id: "wish-you-were-here-floyd",
    title: "Wish You Were Here",
    artist: "Pink Floyd",
    year: 1975,
    aliases: [
      "wish you were here",
      "pink floyd wish you were here",
      "wish you were here floyd",
    ],
    tuning: TUNINGS.standard,
    key: "G",
    verdict:
      "Acoustic rhythm part on the record is standard tuning. Intro and verse share the same chord palette.",
    sections: [
      {
        name: "Intro / Verse",
        chords: ["G", "Em", "A", "Em", "G", "Em", "A", "C"],
      },
    ],
  },
  {
    id: "horse-with-no-name-america",
    title: "A Horse with No Name",
    artist: "America",
    year: 1971,
    aliases: ["horse with no name", "a horse with no name", "america horse"],
    tuning: TUNINGS.standard,
    key: "E minor",
    verdict:
      "Two-chord song on standard tuning. The second chord is the famous Em–D6add9/F# move heard on the record.",
    sections: [
      {
        name: "Verse / Chorus",
        chords: ["Em", "D6/F#"],
      },
    ],
  },
  {
    id: "brown-eyed-girl-morrison",
    title: "Brown Eyed Girl",
    artist: "Van Morrison",
    year: 1967,
    aliases: ["brown eyed girl", "van morrison brown eyed girl"],
    tuning: TUNINGS.standard,
    key: "G",
    verdict:
      "Standard tuning, no capo. Classic I–IV–V movement in G throughout the hit single.",
    sections: [
      {
        name: "Verse / Chorus",
        chords: ["G", "C", "G", "D"],
      },
    ],
  },
  {
    id: "smoke-on-the-water-deep-purple",
    title: "Smoke on the Water",
    artist: "Deep Purple",
    year: 1972,
    aliases: ["smoke on the water", "deep purple smoke", "smoke on water"],
    tuning: TUNINGS.standard,
    key: "G minor",
    verdict:
      "Iconic riff uses standard tuning power chords on the low strings — the part everyone learns first.",
    sections: [
      {
        name: "Main riff",
        chords: ["G5", "Bb5", "C5"],
      },
    ],
  },
  {
    id: "black-pearl-jam",
    title: "Black",
    artist: "Pearl Jam",
    year: 1991,
    aliases: ["black pearl jam", "black", "pearl jam black"],
    tuning: TUNINGS.standard,
    key: "E",
    verdict:
      "Album version is standard tuning. Verse progression centers on open-position E, A, and C shapes.",
    sections: [
      {
        name: "Verse",
        chords: ["E", "A", "C", "E", "A", "E"],
      },
    ],
  },
  {
    id: "nothing-else-matters-metallica",
    title: "Nothing Else Matters",
    artist: "Metallica",
    year: 1991,
    aliases: [
      "nothing else matters",
      "metallica nothing else matters",
      "nothing else matters metallica",
    ],
    tuning: TUNINGS.standard,
    key: "E minor",
    verdict:
      "Clean intro and verses on the record use standard tuning with arpeggiated open chords.",
    sections: [
      {
        name: "Intro / Verse",
        chords: ["Em", "C", "D", "G", "B7"],
      },
    ],
  },
  {
    id: "stairway-to-heaven-zeppelin",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    year: 1971,
    aliases: [
      "stairway to heaven",
      "stairway",
      "led zeppelin stairway",
      "stairway to heaven zeppelin",
    ],
    tuning: TUNINGS.standard,
    key: "A minor",
    verdict:
      "Opening acoustic passage is standard tuning. Progression below matches the famous intro chord sequence.",
    sections: [
      {
        name: "Intro",
        chords: ["Am", "AmM7", "Am7", "D/F#", "Fmaj7", "G", "Am"],
      },
    ],
  },
];

export function getSongById(id: string): SongTab | undefined {
  return SONG_DATABASE.find((song) => song.id === id);
}
