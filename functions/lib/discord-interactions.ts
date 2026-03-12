import nacl from "tweetnacl";

export type DiscordInteraction = {
  type: number;
  id: string;
  token: string;
  data?: {
    name?: string;
    options?: Array<{
      name: string;
      value?: string | number | boolean;
    }>;
  };
  member?: {
    user?: {
      id: string;
      username: string;
    };
  };
};

export type DiscordResponse = {
  type: number;
  data?: Record<string, unknown>;
};

const encoder = new TextEncoder();

const hexToUint8 = (hex: string) =>
  new Uint8Array(hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? []);

export function verifyDiscordRequest(
  request: Request,
  body: string,
  publicKey: string,
): boolean {
  const signature = request.headers.get("x-signature-ed25519") || "";
  const timestamp = request.headers.get("x-signature-timestamp") || "";

  if (!signature || !timestamp) {
    return false;
  }

  const message = encoder.encode(timestamp + body);
  return nacl.sign.detached.verify(
    message,
    hexToUint8(signature),
    hexToUint8(publicKey),
  );
}

export function jsonResponse(payload: DiscordResponse) {
  return new Response(JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" },
  });
}
