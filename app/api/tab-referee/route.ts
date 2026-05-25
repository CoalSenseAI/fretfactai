import {
  getAmbiguousMatches,
  lookupTabReferee,
  lookupTabRefereeById,
  TabRefereeError,
} from "@/lib/tab-referee";

export async function POST(request: Request) {
  let body: { query?: string; songId?: string };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const query = body.query?.trim() ?? "";
  const songId = body.songId?.trim();

  if (!query && !songId) {
    return Response.json({ error: "Enter a song title." }, { status: 400 });
  }

  try {
    const result = songId
      ? lookupTabRefereeById(songId)
      : lookupTabReferee(query);

    return Response.json(result);
  } catch (error) {
    if (error instanceof TabRefereeError) {
      const matches = query ? getAmbiguousMatches(query) : [];
      return Response.json(
        {
          error: error.message,
          matches: matches.length > 1 ? matches : undefined,
        },
        { status: matches.length > 1 ? 409 : 404 },
      );
    }

    return Response.json({ error: "Could not look up that song." }, { status: 500 });
  }
}
