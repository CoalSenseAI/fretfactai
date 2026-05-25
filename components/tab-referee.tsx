"use client";

import { useState, type FormEvent } from "react";
import type { SongMatch, TabRefereeResult } from "@/lib/tab-referee";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChordDiagram } from "@/components/chord-diagram";

interface ApiError {
  error: string;
  matches?: SongMatch[];
}

export function TabReferee() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TabRefereeResult | null>(null);
  const [matches, setMatches] = useState<SongMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchSong(searchQuery: string, songId?: string) {
    setLoading(true);
    setError(null);
    setMatches([]);

    try {
      const response = await fetch("/api/tab-referee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, songId }),
      });

      const data = (await response.json()) as TabRefereeResult | ApiError;

      if (!response.ok) {
        const apiError = data as ApiError;
        setResult(null);
        setError(apiError.error);
        setMatches(apiError.matches ?? []);
        return;
      }

      setResult(data as TabRefereeResult);
    } catch {
      setResult(null);
      setError("Something went wrong. Check that the dev server is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    void fetchSong(trimmed);
  }

  function handlePickMatch(songId: string) {
    void fetchSong(query, songId);
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Tab Referee</h1>
        <p className="text-muted-foreground">
          Song title in — verified tuning, chords, and voicings out.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. Wonderwall, Sweet Child O' Mine"
          className="flex-1"
          aria-label="Song title"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Checking…" : "Ref"}
        </Button>
      </form>

      {error ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
          {matches.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {matches.map((match) => (
                <Button
                  key={match.id}
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-start"
                  onClick={() => handlePickMatch(match.id)}
                >
                  <span className="font-semibold">{match.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {match.artist}
                  </span>
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {result.song.title}
                {result.song.year ? (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    ({result.song.year})
                  </span>
                ) : null}
              </CardTitle>
              <CardDescription>{result.song.artist}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{result.song.verdict}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-muted px-3 py-1">
                  Tuning: {result.song.tuning.name}
                </span>
                {result.song.capo ? (
                  <span className="rounded-full bg-muted px-3 py-1">
                    Capo: fret {result.song.capo}
                  </span>
                ) : null}
                {result.song.key ? (
                  <span className="rounded-full bg-muted px-3 py-1">
                    Key: {result.song.key}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-sm">
                {result.song.tuning.strings.map((note, index) => (
                  <span
                    key={`${note}-${index}`}
                    className="rounded-md border px-2 py-1"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {result.song.sections.map((section) => (
            <Card key={section.name}>
              <CardHeader>
                <CardTitle className="text-lg">{section.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {section.chords.map((chord, index) => (
                    <span
                      key={`${section.name}-${chord}-${index}`}
                      className="rounded-md bg-primary px-3 py-1 text-primary-foreground font-medium"
                    >
                      {chord}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Voicings</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {result.chords.map((chord) => {
                const resolution = result.voicings[chord];
                const top = resolution?.fingerings[0];
                if (!top) return null;

                return (
                  <Card key={chord} size="sm">
                    <CardContent className="flex flex-col items-center pt-2 pb-3 gap-1">
                      <p className="font-semibold">{chord}</p>
                      <ChordDiagram fingering={top} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
