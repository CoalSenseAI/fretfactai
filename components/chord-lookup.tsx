"use client";

import { useState, type FormEvent } from "react";
import { resolveChord, ChordParseError } from "@/lib/chords";
import type { ChordResolution } from "@/lib/chords";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChordDiagram } from "@/components/chord-diagram";

export function ChordLookup() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ChordResolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      setResult(resolveChord(trimmed));
      setError(null);
    } catch (err) {
      setResult(null);
      setError(
        err instanceof ChordParseError
          ? err.message
          : "Could not parse that chord name.",
      );
    }
  }

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. Cmaj7, G#, F#m7"
          className="flex-1"
          aria-label="Chord name"
        />
        <Button type="submit">Go</Button>
      </form>

      {error ? (
        <p className="text-sm text-destructive text-center" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold">{result.input}</p>
            <p className="text-sm text-muted-foreground">
              Notes: {result.notes.join(" · ")}
            </p>
          </div>

          {result.fingerings.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {result.fingerings.map((fingering, index) => (
                <Card key={index} size="sm">
                  <CardContent className="flex justify-center pt-2 pb-3">
                    <ChordDiagram
                      fingering={fingering}
                      label={`Voicing ${index + 1}`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              No playable fingerings found in standard tuning.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
