import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Historico {
  id: number;
  etapa: number;
  jogador1_id: number;
  jogador2_id: number;
  jogador1: { nome: string };
  jogador2: { nome: string };
}

export function useHistorico() {
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

      const dados: Historico[] = (data as any[]).map((item) => ({
        ...item,
        jogador1: item.jogador1?.[0] ?? item.jogador1 ?? { nome: "Desconhecido" },
        jogador2: item.jogador2?.[0] ?? item.jogador2 ?? { nome: "Desconhecido" },
      }));

      setHistorico(dados);
      setEtapas([...new Set(dados.map((h) => h.etapa))].sort((a, b) => a - b));
      setEtapaAtualIndex(0);
      setLoading(false);
      
    };

    fetchHistorico();
  }, []);

  return {
    historico,
    etapas,
    etapaAtualIndex,
    setEtapaAtualIndex,
    loading,
    setHistorico,
    setEtapas,
  };
}
