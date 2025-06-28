"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Historico {
  id: number;
  etapa: number;
  jogador1_id: number;
  jogador2_id: number;
  jogador1: { nome: string };
  jogador2: { nome: string };
}

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [etapas, setEtapas] = useState<number[]>([]);
  const [etapaAtualIndex, setEtapaAtualIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      const { data, error } = await supabase
        .from("historico")
        .select(`
          id,
          etapa,
          jogador1_id,
          jogador2_id,
          jogador1: jogador1_id ( nome ),
          jogador2: jogador2_id ( nome )
        `)
        .order("etapa", { ascending: true });

      if (error) {
        console.error("Erro ao buscar histórico:", error.message);
        setLoading(false);
        return;
      }

      const dadosConvertidos: Historico[] = (data || []).map((item: any) => ({
        id: item.id,
        etapa: item.etapa,
        jogador1_id: item.jogador1_id,
        jogador2_id: item.jogador2_id,
        jogador1: item.jogador1[0] ?? item.jogador1 ??{ nome: "Desconhecido" },
        jogador2: item.jogador2[0] ?? item.jogador2 ?? { nome: "Desconhecido" },
      }));

      setHistorico(dadosConvertidos);

      const etapasUnicas = Array.from(new Set(dadosConvertidos.map(h => h.etapa))).sort((a, b) => a - b);
      setEtapas(etapasUnicas);
      setEtapaAtualIndex(0);
      setLoading(false);
    };

    fetchHistorico();
  }, []);

  const limparHistorico = async () => {
  const confirmar = confirm("Tem certeza que deseja limpar todo o histórico?");
  if (!confirmar) return;

  const { error } = await supabase.from("historico").delete().neq("id", 0);
  if (error) {
    console.error("Erro ao limpar histórico:", error.message);
    return;
  }

  setHistorico([]);
  setEtapas([]);
  setEtapaAtualIndex(0);
};


  if (loading) return <p>Carregando histórico...</p>;
  if (etapas.length === 0) return <p className="w-full h-full flex items-center justify-center"><span>Nenhum confronto registrado ainda.</span></p>;

  const etapaAtual = etapas[etapaAtualIndex];
  const confrontosDaEtapa = historico.filter((h) => h.etapa === etapaAtual);

  return (
    <main className="w-full h-screen p-4 shadow flex flex-col justify-start items-center bg-gray-100">
      <h1 className="text-2xl font-bold text-center">
        Histórico de Confrontos
      </h1>
      <div className="w-full flex justify-end mt-2">
  <button
    onClick={limparHistorico}
    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
  >
    Limpar Histórico
  </button>
</div>

      
      <nav className="flex justify-center flex-wrap gap-4 mt-6 max-w-[700px] bg-white p-2 rounded shadow">
        <button
          onClick={() => setEtapaAtualIndex(0)}
          disabled={etapaAtualIndex === 0}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
        >
          Primeira
        </button>

        <button
          onClick={() => setEtapaAtualIndex((i) => Math.max(i - 1, 0))}
          disabled={etapaAtualIndex === 0}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
        >
          Anterior
        </button>

        <span className="flex items-center font-semibold text-gray-700">
          Etapa {etapaAtualIndex + 1} de {etapas.length}
        </span>

        <button
          onClick={() =>
            setEtapaAtualIndex((i) => Math.min(i + 1, etapas.length - 1))
          }
          disabled={etapaAtualIndex === etapas.length - 1}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
        >
          Próximo
        </button>

        <button
          onClick={() => setEtapaAtualIndex(etapas.length - 1)}
          disabled={etapaAtualIndex === etapas.length - 1}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
        >
          Última
        </button>
      </nav>

      <section className="mt-2 min-w-[700px] w-[50%] border border-gray-300 rounded-lg p-2 shadow-lg bg-white">
        {/* <h2 className="text-lg font-semibold mb-2">
          Etapa {etapaAtual}
        </h2> */}

        <ul>
          {confrontosDaEtapa.map((item) => (
            <li
              key={item.id}
              className="p-[4px] border-b flex justify-between items-center"
            >
              <span className="font-semibold text-gray-900 min-w-[40%]">
                {item.jogador1.nome}
              </span>
              <span className="font-bold text-lg text-indigo-600">&</span>
              <span className="font-semibold text-gray-900 min-w-[40%]">
                {item.jogador2.nome}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
