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

const buildResultLines = (results: SearchResult[]) =>
  results
    .map(
      (item, index) =>
        `${index + 1}. ${item.title}\n${item.url}\n${item.snippet}`,
    )
    .join("\n\n");

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
    const results = payload.results || [];

    if (results.length === 0) {
      return jsonResponse({
        type: 4,
        data: {
          content: `未找到与「${keyword}」相关的结果。`,
          flags: 64,
        },
      });
    }

    const content = buildResultLines(results);

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
