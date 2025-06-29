import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export type Jogador = {
  id: number;
  nome: string;
};

export function useJogadores() {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function fetchJogadores() {
    const { data, error } = await supabase
      .from("jogadores")
      .select("id, nome")
      .order("nome", { ascending: true });

    if (error) {
      setMsg(`Erro ao carregar jogadores: ${error.message}`);
    } else {
      setJogadores(data || []);
      setMsg("");
    }
  }

  useEffect(() => {
    fetchJogadores();
  }, []);

  return {
    jogadores,
    setJogadores,
    loading,
    setLoading,
    msg,
    setMsg,
    fetchJogadores,
  };
}
