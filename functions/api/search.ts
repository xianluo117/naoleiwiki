import MiniSearch from "minisearch";

type SearchItem = {
  title: string;
  url: string;
  snippet: string;
};

type IndexPayload = {
  documentIds: Record<string, string>;
  storedFields: Record<string, { title?: string; titles?: string[] }>;
};

const worksMatcher = /\/works(?:\/|$)/;

const stripHtml = (value: string) =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildSnippet = (
  titleParts: string[],
  fallback: string,
  maxLength = 200,
) => {
  const combined = titleParts.length > 0 ? titleParts.join(" / ") : fallback;
  const clean = stripHtml(combined);
  if (clean.length <= maxLength) {
    return clean;
  }
  return `${clean.slice(0, maxLength)}…`;
};

const normalizeBase = (base: string) => base.replace(/\/$/, "");

const loadIndex = async (baseUrl: string) => {
  const response = await fetch(
    `${normalizeBase(baseUrl)}/local-search-index.json`,
    {
      headers: { "Cache-Control": "no-store" },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load search index: ${response.status}`);
  }

  return response.text();
};

const buildUrl = (baseUrl: string, rawId: string) => {
  const base = normalizeBase(baseUrl);
  const hashIndex = rawId.indexOf("#");
  const path = hashIndex >= 0 ? rawId.slice(0, hashIndex) : rawId;
  const hash = hashIndex >= 0 ? rawId.slice(hashIndex) : "";
  const normalizedPath = path.replace(/\.html$/, "/");
  return `${base}${normalizedPath}${hash}`;
};

export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const query = (url.searchParams.get("q") || "").trim();
  const limit = Math.min(Number(url.searchParams.get("limit") || "20"), 50);
  const includeWorks = url.searchParams.get("includeWorks") === "1";

  if (!query) {
    return new Response(JSON.stringify({ results: [] }), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const baseUrl = url.origin;

  try {
    const indexJson = await loadIndex(baseUrl);
    const indexData = JSON.parse(indexJson) as IndexPayload;

    const miniSearch = MiniSearch.loadJSON(indexJson, {
      fields: ["title", "titles"],
      storeFields: ["title", "titles"],
    });

    const rawResults = miniSearch.search(query, { prefix: true, fuzzy: 0 });

    const results: SearchItem[] = [];

    for (const result of rawResults) {
      const id = String(result.id);
      const rawPath = indexData.documentIds?.[id] || id;

      if (!includeWorks && worksMatcher.test(rawPath)) {
        continue;
      }

      const stored = indexData.storedFields?.[id];
      const title = stored?.title || result.title || "";
      const titles = (stored?.titles || result.titles || []) as string[];
      const snippet = buildSnippet(titles, title);
      const url = buildUrl(baseUrl, rawPath);

      results.push({ title, url, snippet });

      if (results.length >= limit) {
        break;
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Search failed", message: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
};
