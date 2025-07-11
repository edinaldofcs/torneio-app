"use client";

import { useState } from "react";
import { useHistorico } from "@/lib/useHistorico";
import { gerarCSV, downloadCSV } from "@/lib/csvUtils";
import { supabase } from "@/lib/supabaseClient";
import HistoricoActions from "./HistoricoActions";
import EtapaNavegacao from "./EtapaNavegacao";
import HistoricoList from "./HistoricoList";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function HistoricoPage() {
  const {
    historico,
    etapas,
    etapaAtualIndex,
    setEtapaAtualIndex,
    loading,
    setHistorico,
    setEtapas,
  } = useHistorico();

  // Estado para controlar o modal de confirmação e mensagem
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Estado para guardar a ação a ser executada após confirmação
  const [acaoConfirmada, setAcaoConfirmada] = useState<(() => Promise<void>) | null>(null);


  // Função genérica para abrir o modal, definindo mensagem e ação
  const abrirConfirmacao = (msg: string, acao: () => Promise<void>) => {
  setMessage(msg);
  setAcaoConfirmada(() => acao);
  setConfirmOpen(true);
};


  // Função chamada quando usuário confirma no modal
  const onConfirm = async () => {
    setConfirmOpen(false);
    if (acaoConfirmada) {
      await acaoConfirmada();
      setAcaoConfirmada(null);
    }
  };

  // Limpar todo o histórico
  const limparHistorico = () => {
    abrirConfirmacao(
      "Tem certeza que deseja limpar todo o histórico? Essa ação não poderá ser desfeita.",
      async () => {
        const { error } = await supabase.from("historico").delete().neq("id", 0);
        if (error) {
          console.error("Erro ao limpar:", error.message);
          return;
        }

        setHistorico([]);
        setEtapas([]);
        setEtapaAtualIndex(0);
      }
    );
  };

  // Deletar confrontos da última etapa
  const deletarUltimoHistorico = () => {
    if (historico.length === 0) return;

    const ultimaEtapa = Math.max(...historico.map((h) => Number(h.etapa)));

    abrirConfirmacao(
      "Tem certeza que deseja deletar todos os confrontos da última etapa? Essa ação não poderá ser desfeita.",
      async () => {
        const { error } = await supabase
          .from("historico")
          .delete()
          .eq("etapa", ultimaEtapa);

        if (error) {
          console.error("Erro ao deletar último histórico:", error.message);
          return;
        }

        const novoHistorico = historico.filter((h) => h.etapa !== ultimaEtapa);
        setHistorico(novoHistorico);

        const novasEtapas = [...new Set(novoHistorico.map((h) => h.etapa))];
        setEtapas(novasEtapas);

        if (etapaAtualIndex >= novasEtapas.length) {
          setEtapaAtualIndex(Math.max(novasEtapas.length - 1, 0));
        }
      }
    );
  };

  if (loading)
    return (
      <>
        <div className="absolute inset-0 bg-[url('/logo.jpg')] bg-cover bg-center opacity-5 -z-2" />
        <p className="w-full h-full flex items-center justify-center">
          <span>Carregando histórico...</span>
        </p>
      </>
    );

  if (etapas.length === 0)
    return (
      <>
        <div className="absolute inset-0 bg-[url('/logo.jpg')] bg-cover bg-center opacity-5 -z-2" />
        <p className="w-full h-full flex items-center justify-center">
          <span>Nenhum confronto registrado ainda.</span>
        </p>
      </>
    );

  const etapaAtual = etapas[etapaAtualIndex];
  const confrontos = historico.filter((h) => h.etapa === etapaAtual);

  return (
    <>
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirmação"
        message={message}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
      />

      <main className="w-full h-screen p-4 shadow flex flex-col justify-start items-center">
        <div className="absolute inset-0 bg-[url('/logo.jpg')] bg-cover bg-center opacity-5 -z-2" />
        <h1 className="text-2xl font-bold text-center">Histórico de Confrontos</h1>

        <HistoricoActions
          onExport={() => downloadCSV(gerarCSV(historico))}
          onClear={limparHistorico}
          onDeleteLast={deletarUltimoHistorico}
        />

        <EtapaNavegacao
          etapaAtualIndex={etapaAtualIndex}
          totalEtapas={etapas.length}
          setEtapaAtualIndex={setEtapaAtualIndex}
        />

        <HistoricoList confrontos={confrontos} />
      </main>
    </>
  );
}
