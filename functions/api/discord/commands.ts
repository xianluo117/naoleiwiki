import {
  buildSearchCommand,
  registerGlobalCommands,
} from "../../lib/discord-commands";
import type { Env } from "../../types";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const appId = env.DISCORD_APP_ID || env.DISCORD_CLIENT_ID;

  if (!env.DISCORD_BOT_TOKEN || !appId) {
    return new Response("Missing DISCORD_BOT_TOKEN or DISCORD_APP_ID", {
      status: 500,
    });
  }

  try {
    await registerGlobalCommands(appId, env.DISCORD_BOT_TOKEN, [
      buildSearchCommand(),
    ]);
    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response(String(error), { status: 500 });
  }
};
