"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Jogador {
  id: number;
  nome: string;
}

interface Dupla {
  jogador1: Jogador;
  jogador2: Jogador;
}

type HistoricoItem = {
  jogador1_id: number;
  jogador2_id: number;
  etapa: number;
};

export default function Page() {
  const [cadastrados, setCadastrados] = useState<Jogador[]>([]);
  const [selecionados, setSelecionados] = useState<Jogador[]>([]);
  const [duplas, setDuplas] = useState<Dupla[]>([]);
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [mensagem, setMensagem] = useState("");
  const [historicoConfrontos, setHistoricoConfrontos] = useState<Set<string>>(new Set());

  // Helper para gerar chave única de dupla ordenada
  function gerarChaveDupla(j1: Jogador, j2: Jogador): string {
    const [id1, id2] = j1.id < j2.id ? [j1.id, j2.id] : [j2.id, j1.id];
    return `${id1}-${id2}`;
  }

  // Verifica se dupla já jogou antes
  function jaJogaram(j1: Jogador, j2: Jogador): boolean {
    return historicoConfrontos.has(gerarChaveDupla(j1, j2));
  }

  useEffect(() => {
    async function fetchJogadores() {
      const { data, error } = await supabase
        .from("jogadores")
        .select("id, nome")
        .order("nome", { ascending: true });
      if (!error && data) setCadastrados(data);
    }
    fetchJogadores();
  }, []);

  useEffect(() => {
    async function fetchHistorico() {
      const { data, error } = await supabase
        .from("historico")
        .select("jogador1_id, jogador2_id, etapa")
        .order("etapa", { ascending: false });

      if (!error && data) {
        const historicoData = data as HistoricoItem[];
        const maiorEtapa = historicoData.length > 0 ? Math.max(...historicoData.map((d) => d.etapa)) : 0;
        setEtapaAtual(maiorEtapa + 1);

        const pares = new Set<string>();
        historicoData.forEach(({ jogador1_id, jogador2_id }) => {
          const [id1, id2] = jogador1_id < jogador2_id ? [jogador1_id, jogador2_id] : [jogador2_id, jogador1_id];
          pares.add(`${id1}-${id2}`);
        });
        setHistoricoConfrontos(pares);
      }
    }
    fetchHistorico();
  }, []);

  function adicionarSelecionado(jogador: Jogador) {
    if (!selecionados.some((j) => j.id === jogador.id)) {
      setSelecionados([...selecionados, jogador]);
    }
  }

  function removerSelecionado(jogador: Jogador) {
    setSelecionados(selecionados.filter((j) => j.id !== jogador.id));
  }

  function embaralhar<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  // Backtracking para formar duplas válidas (sem repetir confrontos anteriores)
  function encontrarDuplasValidas(
    jogadores: Jogador[],
    paresAtuais: Dupla[] = []
  ): Dupla[] | null {
    if (jogadores.length === 0) return paresAtuais;

    const [primeiro, ...restantes] = jogadores;

    for (let i = 0; i < restantes.length; i++) {
      const parceiro = restantes[i];
      if (!jaJogaram(primeiro, parceiro)) {
        const novaDupla = { jogador1: primeiro, jogador2: parceiro };
        const restantesFiltrados = restantes.filter((_, idx) => idx !== i);

        const resultado = encontrarDuplasValidas(restantesFiltrados, [...paresAtuais, novaDupla]);
        if (resultado) return resultado;
      }
    }

    return null; // não achou combinação válida
  }

  function sortearDuplas() {
    setMensagem("");

    if (selecionados.length < 2 || selecionados.length % 2 !== 0) {
      setMensagem("Número de jogadores deve ser par e no mínimo 2.");
      setDuplas([]);
      return;
    }

    const duplasValidas = encontrarDuplasValidas(embaralhar(selecionados));

    if (!duplasValidas) {
      setMensagem("Não foi possível formar duplas válidas sem repetir confrontos anteriores.");
      setDuplas([]);
      return;
    }

    const embaralhadas = duplasValidas.sort(() => Math.random() - 0.5);

    setDuplas(embaralhadas);
    setMensagem("");
  }

  async function gravarHistorico() {
    setMensagem("");

    if (duplas.length === 0) {
      setMensagem("Não há duplas para gravar.");
      return;
    }

    const inserts = duplas.map((dupla) => {
      const [j1, j2] =
        dupla.jogador1.id < dupla.jogador2.id
          ? [dupla.jogador1, dupla.jogador2]
          : [dupla.jogador2, dupla.jogador1];
      return {
        etapa: etapaAtual,
        jogador1_id: j1.id,
        jogador2_id: j2.id,
      };
    });

    const { error: insertError } = await supabase.from("historico").insert(inserts);

    if (insertError) {
      setMensagem(`Erro ao gravar histórico: ${insertError.message}`);
    } else {
      setMensagem(`Histórico gravado com sucesso! Etapa ${etapaAtual}`);
      setEtapaAtual(etapaAtual + 1);
      setDuplas([]);
      setSelecionados([]);

      const novosPares = new Set(historicoConfrontos);
      inserts.forEach(({ jogador1_id, jogador2_id }) => {
        const [id1, id2] = jogador1_id < jogador2_id ? [jogador1_id, jogador2_id] : [jogador2_id, jogador1_id];
        novosPares.add(`${id1}-${id2}`);
      });
      setHistoricoConfrontos(novosPares);
    }
  }

  async function limparHistorico() {
    const confirmar = confirm("Tem certeza que deseja limpar todo o histórico?");
    if (!confirmar) return;

    const { error } = await supabase.from("historico").delete().neq("id", 0);

    if (error) {
      setMensagem(`Erro ao limpar histórico: ${error.message}`);
    } else {
      setMensagem("Histórico limpo com sucesso.");
      setDuplas([]);
      setSelecionados([]);
      setEtapaAtual(1);
      setHistoricoConfrontos(new Set());
    }
  }

  return (
    <main className="w-full h-full p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-100">
      {/* Jogadores cadastrados */}
      <section className="bg-white rounded-lg shadow p-4 overflow-auto max-h-[80vh]">
        <h2 className="text-lg font-semibold mb-4">Cadastrados</h2>
        <ul className="space-y-2">
          {cadastrados.map((j) => {
            const selecionado = selecionados.some((s) => s.id === j.id);
            return (
              <li key={j.id} className="flex items-center justify-between">
                <span>{j.nome}</span>
                <button
                  onClick={() => adicionarSelecionado(j)}
                  disabled={selecionado}
                  className={`px-2 py-1 rounded text-sm text-white transition ${
                    selecionado ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {selecionado ? "Adicionado" : "Adicionar"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Selecionados */}
      <section className="bg-white rounded-lg shadow p-4 overflow-auto max-h-[80vh]">
        <h2 className="text-lg font-semibold mb-4">Selecionados</h2>
        {selecionados.length === 0 ? (
          <p className="text-gray-500">Nenhum selecionado.</p>
        ) : (
          <ul className="space-y-2">
            {selecionados.map((j, i) => (
              <li key={j.id} className="flex items-center justify-between">
                <span>
                  {i + 1}. {j.nome}
                </span>
                <button
                  onClick={() => removerSelecionado(j)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Duplas sorteadas */}
      <section className="bg-white rounded-lg shadow p-4 overflow-auto max-h-[80vh] col-span-1">
        <h2 className="text-lg font-semibold mb-4">Duplas Sorteadas</h2>
        {duplas.length === 0 ? (
          <p className="text-gray-500">Nenhuma dupla sorteada ainda.</p>
        ) : (
          <ol className="list-decimal list-inside space-y-1">
            {duplas.map((d, idx) => (
              <li key={idx}>
                {d.jogador1.nome} &amp; {d.jogador2.nome}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Botões */}
      <section className="flex flex-col justify-between h-1/2">
        <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-4">Ação</h2>
            <p className="text-gray-600 mb-6">Etapa atual: {etapaAtual}</p>
            <button
              onClick={sortearDuplas}
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded mb-4"
            >
              Sortear Duplas
            </button>
            <button
              onClick={gravarHistorico}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded mb-4"
              disabled={duplas.length === 0}
            >
              Gravar Histórico
            </button>
            <button
              onClick={limparHistorico}
              className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded"
            >
              Limpar Histórico
            </button>
          </div>
          {mensagem && (
            <p
              className={`mt-4 text-sm font-medium text-center ${
                mensagem.toLowerCase().includes("erro") ? "text-red-600" : "text-green-600"
              }`}
            >
              {mensagem}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
