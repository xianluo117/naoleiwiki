import {
  buildSearchCommand,
  registerGlobalCommands,
} from "../../lib/discord-commands";
import type { Env } from "../../types";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context;

  if (!env.DISCORD_BOT_TOKEN || !env.DISCORD_APP_ID) {
    return new Response("Missing DISCORD_BOT_TOKEN or DISCORD_APP_ID", {
      status: 500,
    });
  }

  try {
    await registerGlobalCommands(env.DISCORD_APP_ID, env.DISCORD_BOT_TOKEN, [
      buildSearchCommand(),
    ]);
    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response(String(error), { status: 500 });
  }
};
