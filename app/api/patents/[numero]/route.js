import { proxyUpstream } from "../../../../lib/upstream";

export async function GET(_request, { params }) {
  if (!params?.numero) {
    return Response.json({ error: "Parametro numero obrigatorio" }, { status: 400 });
  }

  const numero = encodeURIComponent(String(params.numero));
  return proxyUpstream(`/patents/${numero}`);
}