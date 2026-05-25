import Link from "next/link";
import { TabReferee } from "@/components/tab-referee";

export default function TabRefereePage() {
  return (
    <main className="flex flex-col items-center px-4 md:px-8 py-12">
      <TabReferee />
      <Link
        href="/"
        className="mt-12 text-sm text-muted-foreground underline hover:text-foreground"
      >
        ← Back to home
      </Link>
    </main>
  );
}
