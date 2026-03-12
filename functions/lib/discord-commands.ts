const DISCORD_API_BASE = "https://discord.com/api/v10";

type CommandOption = {
  type: number;
  name: string;
  name_localizations?: Record<string, string>;
  description: string;
  description_localizations?: Record<string, string>;
  required?: boolean;
};

type CommandPayload = {
  name: string;
  name_localizations?: Record<string, string>;
  description: string;
  description_localizations?: Record<string, string>;
  type: number;
  options?: CommandOption[];
};

export async function registerGlobalCommands(
  appId: string,
  token: string,
  commands: CommandPayload[],
): Promise<void> {
  const response = await fetch(
    `${DISCORD_API_BASE}/applications/${appId}/commands`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Register commands failed: ${response.status} ${errorText}`,
    );
  }
}

export function buildSearchCommand(): CommandPayload {
  return {
    name: "wenti-sousuo",
    name_localizations: {
      "zh-CN": "问题搜索",
    },
    description: "Search knowledge base",
    description_localizations: {
      "zh-CN": "搜索知识库并返回结果",
    },
    type: 1,
    options: [
      {
        type: 3,
        name: "keyword",
        name_localizations: {
          "zh-CN": "关键词",
        },
        description: "Search keyword",
        description_localizations: {
          "zh-CN": "要搜索的关键词",
        },
        required: true,
      },
    ],
  };
}
