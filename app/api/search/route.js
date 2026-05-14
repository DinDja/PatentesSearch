import { proxyUpstream } from "../../../lib/upstream";

export async function GET(request) {
  const query = Object.fromEntries(request.nextUrl.searchParams.entries());
  return proxyUpstream("/search", query);
}