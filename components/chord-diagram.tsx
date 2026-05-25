import { STANDARD_TUNING } from "@/lib/chords";
import type { Fingering } from "@/lib/chords";

const STRING_LABELS = STANDARD_TUNING;

interface ChordDiagramProps {
  fingering: Fingering;
  label?: string;
}

function displayRange(frets: (number | null)[]) {
  const played = frets.filter((f): f is number => f !== null);
  if (played.length === 0) return { start: 1, showNut: true };

  const min = Math.min(...played);
  const max = Math.max(...played);

  if (max <= 4 && min === 0) {
    return { start: 1, showNut: true };
  }

  return { start: Math.max(1, min), showNut: false };
}

export function ChordDiagram({ fingering, label }: ChordDiagramProps) {
  const { frets } = fingering;
  const { start, showNut } = displayRange(frets);
  const fretCount = 4;
  const width = 100;
  const height = 120;
  const padding = { top: 22, left: 14, right: 14, bottom: 10 };
  const gridWidth = width - padding.left - padding.right;
  const gridHeight = height - padding.top - padding.bottom;
  const stringCount = 6;
  const stringSpacing = gridWidth / (stringCount - 1);
  const fretSpacing = gridHeight / fretCount;

  return (
    <figure className="flex flex-col items-center gap-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-32 w-24 text-foreground"
        aria-label={label ?? "Chord diagram"}
      >
        {!showNut && (
          <text
            x={padding.left - 2}
            y={padding.top + fretSpacing * 0.55}
            className="fill-muted-foreground text-[8px]"
          >
            {start}fr
          </text>
        )}

        {Array.from({ length: stringCount }, (_, i) => {
          const x = padding.left + i * stringSpacing;
          return (
            <line
              key={`string-${i}`}
              x1={x}
              y1={padding.top}
              x2={x}
              y2={padding.top + gridHeight}
              className="stroke-foreground/70"
              strokeWidth={i === 0 || i === stringCount - 1 ? 1.4 : 0.9}
            />
          );
        })}

        {showNut ? (
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left + gridWidth}
            y2={padding.top}
            className="stroke-foreground"
            strokeWidth={2.5}
          />
        ) : (
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left + gridWidth}
            y2={padding.top}
            className="stroke-foreground/50"
            strokeWidth={1}
          />
        )}

        {Array.from({ length: fretCount + 1 }, (_, i) => {
          const y = padding.top + i * fretSpacing;
          return (
            <line
              key={`fret-${i}`}
              x1={padding.left}
              y1={y}
              x2={padding.left + gridWidth}
              y2={y}
              className="stroke-foreground/35"
              strokeWidth={0.8}
            />
          );
        })}

        {frets.map((fret, stringIndex) => {
          const x = padding.left + stringIndex * stringSpacing;

            if (fret === null) {
              return (
                <text
                  key={`mute-${stringIndex}`}
                  x={x}
                  y={padding.top - 6}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[9px] font-medium"
                >
                  ×
                </text>
              );
            }

            if (fret === 0 && showNut) {
              return (
                <circle
                  key={`open-${stringIndex}`}
                  cx={x}
                  cy={padding.top - 8}
                  r={3.2}
                  className="fill-none stroke-foreground"
                  strokeWidth={1.2}
                />
              );
            }

            if (fret < start || fret >= start + fretCount) return null;

            const fretIndex = fret - start + 1;
            const y = padding.top + (fretIndex - 0.5) * fretSpacing;

            return (
              <circle
                key={`dot-${stringIndex}`}
                cx={x}
                cy={y}
                r={4.2}
                className="fill-foreground"
              />
            );
          })}

        {STRING_LABELS.map((name, i) => (
          <text
            key={`label-${name}-${i}`}
            x={padding.left + i * stringSpacing}
            y={height - 1}
            textAnchor="middle"
            className="fill-muted-foreground text-[7px]"
          >
            {name}
          </text>
        ))}
      </svg>
      {label ? (
        <figcaption className="text-xs text-muted-foreground">{label}</figcaption>
      ) : null}
    </figure>
  );
}
