const DEFAULT_HEADER = { alg: "RS256", typ: "JWT" };

export function createToken(payload: any, header: any = DEFAULT_HEADER): string {
  const h = Buffer.from(JSON.stringify(header)).toString("base64");
  const p = Buffer.from(JSON.stringify(payload)).toString("base64");
  return `${h}.${p}.signature`;
}
