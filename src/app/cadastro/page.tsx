"use client";

import { useState } from "react";
import { useJogadores } from "@/lib/useJogadores";
import { gerarCSVJogadores, downloadCSV } from "@/lib/csvUtils";
import { Jogador } from "@/lib/useJogadores";
import { supabase } from "@/lib/supabaseClient";
import JogadorLista from "./JogadorLista";
import JogadorForm from "./JogadorForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import toast from "react-hot-toast";

export default function CadastroPage() {
  const {
    jogadores,
    setJogadores,
    loading,
    setLoading,
    fetchJogadores,
  } = useJogadores();

  const [nome, setNome] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [jogadorParaExcluir, setJogadorParaExcluir] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("jogadores").insert([{ nome }]);
    setLoading(false);

    if (error) {
      toast.error(`Erro: ${error.message}`);
    } else {
      toast.success("Jogador cadastrado com sucesso!");
      setNome("");
      fetchJogadores();
    }
  }

  function startEdit(jogador: Jogador) {
    setEditId(jogador.id);
    setEditNome(jogador.nome);
  }

  function cancelEdit() {
    setEditId(null);
    setEditNome("");
  }

  async function saveEdit(id: number) {
    if (!editNome.trim()) {
      toast.error("Nome não pode ser vazio");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("jogadores")
      .update({ nome: editNome.trim() })
      .eq("id", id);
    setLoading(false);

    if (error) {
      toast.error(`Erro ao atualizar: ${error.message}`);
    } else {
      toast.success("Jogador atualizado com sucesso!");
      setEditId(null);
      setEditNome("");
      fetchJogadores();
    }
  }

  function pedirConfirmacaoExclusao(id: number) {
    setJogadorParaExcluir(id);
    setConfirmOpen(true);
  }

  async function confirmarExclusao() {
    if (jogadorParaExcluir == null) return;

    setLoading(true);
    const { error } = await supabase.from("jogadores").delete().eq("id", jogadorParaExcluir);
    setLoading(false);
    setConfirmOpen(false);
    setJogadorParaExcluir(null);

    if (error) {
      toast.error(`Erro ao deletar: ${error.message}`);
    } else {
      toast.success("Jogador deletado com sucesso!");
      fetchJogadores();
    }
  }

  function exportarCSV() {
    const csv = gerarCSVJogadores(jogadores);
    downloadCSV(csv, "jogadores.csv");
    toast.success("CSV exportado com sucesso!");
  }

  return (
    <main className="w-full mx-auto p-6 flex flex-col justify-between gap-10 md:flex-row relative">
      <div className="absolute inset-0 bg-[url('/logo.jpg')] bg-cover bg-center opacity-5 -z-2" />

      <JogadorLista
        jogadores={jogadores}
        editId={editId}
        editNome={editNome}
        setEditNome={setEditNome}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        saveEdit={saveEdit}
        deleteJogador={pedirConfirmacaoExclusao}
        downloadCSV={exportarCSV}
        loading={loading}
      />

      <JogadorForm
        nome={nome}
        setNome={setNome}
        onSubmit={handleSubmit}
        loading={loading}
        msg=""
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        message="Tem certeza que deseja deletar este jogador?"
        onCancel={() => {
          setConfirmOpen(false);
          setJogadorParaExcluir(null);
        }}
        onConfirm={confirmarExclusao}
      />
    </main>
  );
}
