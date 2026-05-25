import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChordLookup } from "@/components/chord-lookup";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4 md:px-8">
      {/* Hero */}
      <section className="w-full max-w-5xl text-center py-20">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">FretFact AI</h1>
        <p className="text-xl md:text-2xl text-muted-foreground">
          Definitive, friction‑free guitar intelligence for bedroom players
        </p>
      </section>

      {/* Feature Cards */}
      <section className="grid gap-6 grid-cols-1 md:grid-cols-3 max-w-5xl w-full">
        <Link href="/tab-referee" className="block">
          <Card className="hover:shadow-lg transition h-full">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Tab Referee</h2>
              <p className="text-sm text-muted-foreground">
                Feed any song title and get bullet‑proof chords, tuning &amp; voicings
                straight from the record.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Genre Swapper</h2>
            <p className="text-sm text-muted-foreground">
              Transform basic progressions into advanced voicings tailored to your
              target genre.
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Tuning Blueprints</h2>
            <p className="text-sm text-muted-foreground">
              Instantly see the exact string‑by‑string notes for any alternate
              tuning.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Try It Now */}
      <section className="w-full max-w-3xl mt-16 mb-24">
        <h2 className="text-3xl font-semibold text-center mb-6">Try it now</h2>
        <ChordLookup />
      </section>

      {/* Waitlist / Contact */}
      <section className="w-full bg-muted py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Join the waitlist &amp; get early access
          </h2>
          <div className="flex gap-4 justify-center">
            <Input placeholder="you@example.com" className="max-w-xs" />
            <Button>Notify me</Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Questions? Email{' '}
            <a
              href="mailto:hello@fretfact.ai"
              className="underline hover:text-foreground"
            >
              hello@fretfact.ai
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
