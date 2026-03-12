import type { DiscordInteraction } from "../../lib/discord-interactions";
import {
  jsonResponse,
  verifyDiscordRequest,
} from "../../lib/discord-interactions";
import type { Env } from "../../types";

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

const RECENT_PATH_MATCHER = /\/faq\/recent(?:\/|$|\.html#)/;
const MAX_MESSAGE_LENGTH = 1800;

const getOption = (
  interaction: DiscordInteraction,
  name: string,
): string | null => {
  const option = interaction.data?.options?.find((item) => item.name === name);
  if (!option || option.value == null) {
    return null;
  }
  return String(option.value);
};

const stripHtml = (value: string) =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractSectionText = (html: string, anchorId: string) => {
  const escaped = escapeRegExp(anchorId);
  const sectionRegex = new RegExp(
    `<h[1-3][^>]*id="${escaped}"[^>]*>[\\s\\S]*?<\\/h[1-3]>([\\s\\S]*?)(?=<h[1-3][^>]*id=|$)`,
    "i",
  );
  const match = html.match(sectionRegex);
  if (!match) {
    return "";
  }
  return stripHtml(match[1]);
};

const extractPageSummary = (html: string) => {
  const docMatch = html.match(/<div class="vp-doc"[^>]*>([\s\S]*?)<\/div>/i);
  if (!docMatch) {
    return "";
  }
  const content = docMatch[1];
  const pMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!pMatch) {
    return stripHtml(content);
  }
  return stripHtml(pMatch[1]);
};

const fetchResultContent = async (url: string) => {
  try {
    const target = new URL(url);
    const anchor = target.hash ? decodeURIComponent(target.hash.slice(1)) : "";
    target.hash = "";
    const response = await fetch(target.toString());
    if (!response.ok) {
      return "";
    }
    const html = await response.text();
    if (anchor) {
      const section = extractSectionText(html, anchor);
      if (section) {
        return section;
      }
    }
    return extractPageSummary(html);
  } catch {
    return "";
  }
};

const buildResultLines = (results: SearchResult[]) =>
  results
    .map((item, index) => `${index + 1}. ${item.title}\n${item.snippet}`)
    .join("\n\n");

const limitMessage = (value: string) =>
  value.length > MAX_MESSAGE_LENGTH
    ? `${value.slice(0, MAX_MESSAGE_LENGTH - 1)}…`
    : value;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const body = await request.text();

  if (!verifyDiscordRequest(request, body, env.DISCORD_PUBLIC_KEY)) {
    return new Response("Invalid request signature", { status: 401 });
  }

  const interaction = JSON.parse(body) as DiscordInteraction;

  if (interaction.type === 1) {
    return jsonResponse({ type: 1 });
  }

  if (interaction.type === 2 && interaction.data?.name === "wenti-sousuo") {
    const keyword = getOption(interaction, "keyword")?.trim();
    if (!keyword) {
      return jsonResponse({
        type: 4,
        data: {
          content: "请提供要搜索的关键词。",
          flags: 64,
        },
      });
    }

    const searchUrl = new URL("/api/search", request.url);
    searchUrl.searchParams.set("q", keyword);
    searchUrl.searchParams.set("limit", "5");

    const response = await fetch(searchUrl.toString(), {
      headers: { "Cache-Control": "no-store" },
    });

    if (!response.ok) {
      return jsonResponse({
        type: 4,
        data: {
          content: "搜索服务暂时不可用，请稍后再试。",
          flags: 64,
        },
      });
    }

    const payload = (await response.json()) as { results: SearchResult[] };
    const rawResults = payload.results || [];
    const augmentedResults = [...rawResults];
    const recentEntry = rawResults.find((item) =>
      RECENT_PATH_MATCHER.test(item.url),
    );
    if (!recentEntry) {
      const recentUrl = new URL("/faq/recent", request.url).toString();
      augmentedResults.unshift({
        title: "近期常见",
        url: recentUrl,
        snippet: "",
      });
    }
    const results = [...augmentedResults].sort((a, b) => {
      const aRecent = RECENT_PATH_MATCHER.test(a.url) ? 0 : 1;
      const bRecent = RECENT_PATH_MATCHER.test(b.url) ? 0 : 1;
      return aRecent - bRecent;
    });

    if (results.length === 0) {
      return jsonResponse({
        type: 4,
        data: {
          content: `未找到与「${keyword}」相关的结果。`,
          flags: 64,
        },
      });
    }

    const enrichedResults: SearchResult[] = [];
    for (const result of results) {
      const content = await fetchResultContent(result.url);
      enrichedResults.push({
        ...result,
        snippet: content || result.snippet,
      });
    }

    const content = limitMessage(buildResultLines(enrichedResults));

    return jsonResponse({
      type: 4,
      data: {
        content,
        flags: 64,
      },
    });
  }

  return jsonResponse({
    type: 4,
    data: {
      content: "未知命令。",
      flags: 64,
    },
  });
};
