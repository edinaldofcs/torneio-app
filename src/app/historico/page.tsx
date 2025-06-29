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

  const [confirmOpen, setConfirmOpen] = useState(false);

  const limparHistorico = async () => {
    setConfirmOpen(true);
  };

  const confirmarLimpeza = async () => {
    setConfirmOpen(false);
    const { error } = await supabase.from("historico").delete().neq("id", 0);
    if (error) return console.error("Erro ao limpar:", error.message);

    setHistorico([]);
    setEtapas([]);
    setEtapaAtualIndex(0);
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
        title="Limpar Histórico"
        message="Tem certeza que deseja limpar todo o histórico? Essa ação não poderá ser desfeita."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmarLimpeza}
      />
      <main className="w-full h-screen p-4 shadow flex flex-col justify-start items-center">
        <div className="absolute inset-0 bg-[url('/logo.jpg')] bg-cover bg-center opacity-5 -z-2" />
        <h1 className="text-2xl font-bold text-center">
          Histórico de Confrontos
        </h1>

        <HistoricoActions
          onExport={() => downloadCSV(gerarCSV(historico))}
          onClear={limparHistorico}
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
