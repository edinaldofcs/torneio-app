"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CadastroList } from "@/components/ui/CadastroList";
import { SelecionadosList } from "@/components/ui/SelecionadosList";
import { DuplasList } from "@/components/ui/DuplasList";
import { Acoes } from "@/components/ui/Acoes";
import toast from "react-hot-toast";

interface Jogador {
  id: number;
  nome: string;
}

interface Dupla {
  jogador1: Jogador;
  jogador2: Jogador;
}

export default function Page() {
  const [cadastrados, setCadastrados] = useState<Jogador[]>([]);
  const [selecionados, setSelecionados] = useState<Jogador[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const armazenados = localStorage.getItem("selecionados");
        return armazenados ? JSON.parse(armazenados) : [];
      } catch (e) {
        console.error("Erro ao carregar selecionados:", e);
        return [];
      }
    }
    return [];
  });
  const [duplas, setDuplas] = useState<Dupla[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const armazenadas = localStorage.getItem("duplas");
        return armazenadas ? JSON.parse(armazenadas) : [];
      } catch (e) {
        console.error("Erro ao carregar duplas:", e);
        return [];
      }
    }
    return [];
  });

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [mensagem, setMensagem] = useState("");
  const [paresManuais, setParesManuais] = useState<Dupla[]>([]);
  const [bufferParManual, setBufferParManual] = useState<Jogador | null>(null);
  const [historicoConfrontos, setHistoricoConfrontos] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    async function fetchJogadores() {
      const { data, error } = await supabase
        .from("jogadores")
        .select("id, nome")
        .order("nome");
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
        const maiorEtapa =
          data.length > 0 ? Math.max(...data.map((d) => d.etapa)) : 0;
        setEtapaAtual(maiorEtapa + 1);

        const pares = new Set<string>();
        data.forEach(({ jogador1_id, jogador2_id }) => {
          const [id1, id2] =
            jogador1_id < jogador2_id
              ? [jogador1_id, jogador2_id]
              : [jogador2_id, jogador1_id];
          pares.add(`${id1}-${id2}`);
        });
        setHistoricoConfrontos(pares);
      }
    }
    fetchHistorico();
  }, []);

  function adicionarSelecionado(jogador: Jogador, ctrlKey = false) {
    const jaSelecionado = selecionados.some((j) => j.id === jogador.id);
    if (!jaSelecionado) {
      setSelecionados((prev) => [...prev, jogador]);
    }

    if (ctrlKey) {
      if (bufferParManual) {
        const novoPar: Dupla = { jogador1: bufferParManual, jogador2: jogador };
        setParesManuais((prev) => [...prev, novoPar]);
        setBufferParManual(null);
      } else {
        setBufferParManual(jogador);
      }
    }
  }

  // Restaurar selecionados e duplas ao carregar a página
  useEffect(() => {
    try {
      const armazenadosSelecionados = localStorage.getItem(
        "selecionados"
      );
      if (armazenadosSelecionados) {
        const parsedSelecionados = JSON.parse(armazenadosSelecionados);
        if (Array.isArray(parsedSelecionados)) {
          setSelecionados(parsedSelecionados);
        }
      }

      const armazenadasDuplas = localStorage.getItem("duplas");
      if (armazenadasDuplas) {
        const parsedDuplas = JSON.parse(armazenadasDuplas);
        if (Array.isArray(parsedDuplas)) {
          setDuplas(parsedDuplas);
        }
      }
    } catch (error) {
      console.error("Erro ao restaurar dados do localStorage:", error);
    }
  }, []);

  // Salvar selecionados no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("selecionados", JSON.stringify(selecionados));
  }, [selecionados]);

  useEffect(() => {
    localStorage.setItem("duplas", JSON.stringify(duplas));
  }, [duplas]);

  function removerSelecionado(jogador: Jogador) {
    setSelecionados(selecionados.filter((j) => j.id !== jogador.id));
    setParesManuais(
      paresManuais.filter(
        (p) => p.jogador1.id !== jogador.id && p.jogador2.id !== jogador.id
      )
    );
    if (bufferParManual?.id === jogador.id) {
      setBufferParManual(null);
    }
  }

  function jaJogaram(jog1: Jogador, jog2: Jogador): boolean {
    const [id1, id2] =
      jog1.id < jog2.id ? [jog1.id, jog2.id] : [jog2.id, jog1.id];
    return historicoConfrontos.has(`${id1}-${id2}`);
  }

  function embaralhar<T>(array: T[]): T[] {
  const novoArray = [...array];
  for (let i = novoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
  }
  return novoArray;
}

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

        const resultado = encontrarDuplasValidas(restantesFiltrados, [
          ...paresAtuais,
          novaDupla,
        ]);
        if (resultado) return resultado;
      }
    }

    return null;
  }

  function sortearDuplas() {
    setMensagem("");

    const idsFixos = new Set(
      paresManuais.flatMap((p) => [p.jogador1.id, p.jogador2.id])
    );

    const jogadoresLivres = selecionados.filter((j) => !idsFixos.has(j.id));

    if (jogadoresLivres.length % 2 !== 0) {
      // setMensagem("Número de jogadores livres deve ser par.");
      toast.error("Número de jogadores livres deve ser par.");
      setDuplas([]);
      return;
    }

    const duplasValidas = encontrarDuplasValidas(embaralhar(jogadoresLivres));

    if (!duplasValidas || duplasValidas.length == 0) {
      console.log("Entrou");

      // setMensagem("Não foi possível formar duplas válidas.");
      toast.error("Não foi possível formar duplas válidas.");
      setDuplas([]);
      return;
    }

    

    setDuplas(embaralhar([...duplasValidas, ...paresManuais]));

    toast.success("Duplas sorteadas com sucesso!");
    // setMensagem("");
  }

  async function gravarHistorico() {
    setMensagem("");

    if (duplas.length === 0) {
      // setMensagem("Não há duplas para gravar.");
      toast.error("Não há duplas para gravar.");
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

    const { error } = await supabase.from("historico").insert(inserts);

    if (error) {
      // setMensagem(`Erro ao gravar histórico: ${error.message}`);
      toast.error(`Erro ao gravar histórico: ${error.message}`);
    } else {
      toast.success(`Histórico gravado com sucesso! Etapa ${etapaAtual}`);
      // setMensagem(`Histórico gravado com sucesso! Etapa ${etapaAtual}`);
      setEtapaAtual(etapaAtual + 1);
      setDuplas([]);
      setSelecionados([]);
      setParesManuais([]);
      setBufferParManual(null);

      localStorage.removeItem("duplas");
      localStorage.removeItem("selecionados");

      const novosPares = new Set(historicoConfrontos);
      inserts.forEach(({ jogador1_id, jogador2_id }) => {
        const [id1, id2] =
          jogador1_id < jogador2_id
            ? [jogador1_id, jogador2_id]
            : [jogador2_id, jogador1_id];
        novosPares.add(`${id1}-${id2}`);
      });
      setHistoricoConfrontos(novosPares);
    }
  }

  return (
    <>
    <main className="w-full h-full p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="absolute inset-0 bg-[url('/logo.jpg')] bg-cover bg-center opacity-10 -z-2" />
      <CadastroList cadastrados={cadastrados} selecionados={selecionados} onAdicionar={adicionarSelecionado} />
      <SelecionadosList selecionados={selecionados} onRemover={removerSelecionado} />
      <DuplasList duplas={duplas} />
      <Acoes
        etapaAtual={etapaAtual}
        duplasCount={duplas.length}
        onSortear={sortearDuplas}
        onGravar={gravarHistorico}
      />
    </main>
    </>
  );
}
