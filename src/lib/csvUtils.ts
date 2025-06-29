import { Jogador } from "./useJogadores";
import { Historico } from "./useHistorico";

export function gerarCSV(dados: Historico[]) {
  const headers = ["id", "etapa", "jogador1_id", "jogador1_nome", "jogador2_id", "jogador2_nome"];
  const linhas = dados.map((item) => [
    item.id,
    item.etapa,
    item.jogador1_id,
    `"${item.jogador1.nome.replace(/"/g, '""')}"`,
    item.jogador2_id,
    `"${item.jogador2.nome.replace(/"/g, '""')}"`,
  ]);
  return [headers, ...linhas].map((e) => e.join(",")).join("\r\n");
}

export function downloadCSV(csv: string, filename = "historico.csv") {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


export function gerarCSVJogadores(jogadores: Jogador[]) {
  const headers = ["id", "nome"];
  const linhas = jogadores.map((j) => [
    j.id.toString(),
    `"${j.nome.replace(/"/g, '""')}"`
  ]);

  return [headers, ...linhas]
    .map((linha) => linha.join(","))
    .join("\r\n");
}

