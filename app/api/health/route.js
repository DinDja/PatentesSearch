import { proxyUpstream } from "../../../lib/upstream";

export async function GET() {
  return proxyUpstream("/health");
}